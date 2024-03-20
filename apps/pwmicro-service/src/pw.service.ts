import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as io from 'socket.io-client';

import {
  NewTransactionType,
  TransactionRepository,
} from '@app/database/transaction.repository';
import { WalletRepository } from '@app/database/wallet.repository';
import type { PrismaClient, Transaction, Wallet } from '@prisma/client';
import { PrismaService } from '@app/database';

@Injectable()
export class PWService {
  ws: any;
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @Inject(WalletRepository)
    private walletRepository: WalletRepository,
    @Inject(PrismaService)
    private prismaService: PrismaService,
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

  @Cron(CronExpression.EVERY_MINUTE)
  async process() {
    const transactions = await this.transactionRepository.findNew();
    console.log('Pending Transactions', transactions);
    for (const transaction of transactions) {
      this.prismaService.startTransaction(async (tx) => {
        await this.processOneTransaction(transaction, tx);
      });
    }
  }

  async processOneTransaction(transaction: Transaction, tx: PrismaClient) {
    try {
      this.ws.emit('update_transaction', transaction);
      await this.transactionRepository.update(
        transaction.id,
        {
          status: 'PENDING',
        },
        tx,
      );

      const fromWallet = await this.walletRepository.getById(
        transaction.fromWalletId,
        tx,
      );
      const toWallet = await this.walletRepository.getById(
        transaction.toWalletId,
        tx,
      );

      if (fromWallet.balance < transaction.amount) {
        this.ws.emit('update_transaction', transaction);
        await this.transactionRepository.update(
          transaction.id,
          {
            status: 'FAILED',
          },
          tx,
        );
      } else {
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
        await this.walletRepository.update(fromWallet.id, fromWallet, tx);
        await this.walletRepository.update(toWallet.id, toWallet, tx);

        transaction.status = 'COMPLETE';
        this.ws.emit('update_transaction', transaction);
        const newTransaction = await this.transactionRepository.update(
          transaction.id,
          transaction,
          tx,
        );
        Logger.log('Processed transaction', newTransaction);
      }
    } catch (err) {
      Logger.log(err);
    }
  }
}
