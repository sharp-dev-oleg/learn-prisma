import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import * as io from 'socket.io-client';
import { CronJob } from 'cron';
import {
  NewTransactionType,
  TransactionRepository,
} from '@app/database/transaction.repository';
import { WalletRepository } from '@app/database/wallet.repository';
import type { Wallet } from '@prisma/client';

@Injectable()
export class PWService {
  ws: any;
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @Inject(WalletRepository)
    private walletRepository: WalletRepository,
    private scheduler: SchedulerRegistry,
  ) {
    this.ws = io.connect('http://192.168.1.65:3000', {
      transports: ['websocket'],
    });
  }

  async getTransactions(userId: Wallet['userId']) {
    const walletIds = (await this.walletRepository.findByUserId(userId)).map(
      (s) => s.id,
    );
    return this.transactionRepository.findAllTransactions(walletIds);
  }

  async getWallets(userId: Wallet['userId']) {
    return this.walletRepository.findByUserId(userId);
  }

  async getWallet(id: Wallet['id']) {
    return this.walletRepository.getById(id);
  }

  async send(transactionData: NewTransactionType) {
    const newTransaction =
      await this.transactionRepository.create(transactionData);
    this.ws.emit('update_transaction', newTransaction.id);
    return newTransaction;
  }

  addCronJob() {
    const job = new CronJob(CronExpression.EVERY_MINUTE, () => this.process());
    this.scheduler.addCronJob('pw-proccess', job);
    job.start();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async process() {
    try {
      //await this.transactionRepository.manager.transaction(async (tmanager) => {
      const transactions = await this.transactionRepository.findNew();
      console.log('Pending Transactions', transactions);
      for (const transaction of transactions) {
        this.ws.emit('update_transaction', transaction);
        this.transactionRepository.update(transaction.id, {
          status: 'PENDING',
        });

        const fromWallet = await this.walletRepository.getById(
          transaction.fromWalletId,
        );
        const toWallet = await this.walletRepository.getById(
          transaction.toWalletId,
        );

        if (fromWallet.balance < transaction.amount) {
          this.ws.emit('update_transaction', transaction);
          this.transactionRepository.update(transaction.id, {
            status: 'FAILED',
          });
        } else {
          //await this.walletRepository.manager.transaction(
          //async (wmanager: EntityManager) => {
          fromWallet.balance =
            parseFloat(fromWallet.balance.toString()) -
            parseFloat(transaction.amount.toString());
          toWallet.balance =
            parseFloat(toWallet.balance.toString()) +
            parseFloat(transaction.amount.toString());
          transaction.fromBalance = fromWallet.balance;
          transaction.toBalance = toWallet.balance;
          this.ws.emit('update_wallet', fromWallet);
          this.ws.emit('update_wallet', toWallet);
          this.walletRepository.update(fromWallet.id, fromWallet);
          this.walletRepository.update(toWallet.id, toWallet);
          //},
          //);
          transaction.status = 'COMPLETE';
          this.ws.emit('update_transaction', transaction);
          this.transactionRepository.update(transaction.id, transaction);
        }
      }
      //);
    } catch (err) {
      Logger.log(err);
    }
  }
}
