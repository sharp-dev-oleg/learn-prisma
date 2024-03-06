import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wallet } from '@app/database/models/Wallet';
import { Transaction } from '@app/database/models/Transaction';
import * as moment from 'moment';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import * as io from 'socket.io-client';
import { CronJob } from 'cron';
import { TransactionRepository } from '@app/database/transaction.repository';
import { WalletRepository } from '@app/database/wallet.repository';

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

  async getTransactions(userId: number) {
    // const walletIds = (
    //   await this.walletRepository
    //     .createQueryBuilder('wallet')
    //     .select('id')
    //     .where('wallet.user_id = :userId', { userId })
    //     .getRawMany()
    // ).map((s) => s.id);
    // return await this.transactionRepository
    //   .createQueryBuilder()
    //   .where(`from_wallet_id In (:...walletIds)`, { walletIds })
    //   .orWhere(`to_wallet_id In (:...walletIds)`, { walletIds })
    //   .getMany();
  }

  async getWallets(userId: Wallet['userId']) {
    return this.walletRepository.findByUserId(userId);
  }

  async getWallet(id: Wallet['id']) {
    return this.walletRepository.getById(id);
  }

  async send(transaction: Transaction) {
    // transaction.status = 'NEW';
    // transaction.date = moment().toDate();
    // transaction.fromBalance = 0;
    // transaction.toBalance = 0;
    // const entity = this.transactionRepository.create(transaction);
    // const result = await this.transactionRepository.insert(entity);
    // transaction.id = result.identifiers[0].id;
    // this.ws.emit('update_transaction', transaction);
    // return transaction;
  }

  addCronJob() {
    const job = new CronJob(CronExpression.EVERY_MINUTE, () => this.process());
    this.scheduler.addCronJob('pw-proccess', job);
    job.start();
  }

  //@Cron(CronExpression.EVERY_MINUTE)
  async process() {
    // try {
    //   await this.transactionRepository.manager.transaction(async (tmanager) => {
    //     const transactions = await tmanager.find(Transaction, {
    //       where: {
    //         status: 'NEW',
    //       },
    //     });
    //     for (const transaction of transactions) {
    //       transaction.status = 'PENDING';
    //       this.ws.emit('update_transaction', transaction);
    //       await tmanager.save(transaction);
    //       const fromWallet = await this.walletRepository.findOne({
    //         where: {
    //           id: transaction.fromWalletId,
    //         },
    //       });
    //       const toWallet = await this.walletRepository.findOne({
    //         where: {
    //           id: transaction.toWalletId,
    //         },
    //       });
    //
    //       if (fromWallet.balance < transaction.amount) {
    //         transaction.status = 'FAILED';
    //         this.ws.emit('update_transaction', transaction);
    //         await tmanager.save(transaction);
    //       } else {
    //         await this.walletRepository.manager.transaction(
    //           async (wmanager: EntityManager) => {
    //             fromWallet.balance =
    //               parseFloat(fromWallet.balance.toString()) -
    //               parseFloat(transaction.amount.toString());
    //             toWallet.balance =
    //               parseFloat(toWallet.balance.toString()) +
    //               parseFloat(transaction.amount.toString());
    //             transaction.fromBalance = fromWallet.balance;
    //             transaction.toBalance = toWallet.balance;
    //             this.ws.emit('update_wallet', fromWallet);
    //             this.ws.emit('update_wallet', toWallet);
    //             wmanager.save(fromWallet);
    //             wmanager.save(toWallet);
    //           },
    //         );
    //         transaction.status = 'COMPLETE';
    //         this.ws.emit('update_transaction', transaction);
    //         await tmanager.save(transaction);
    //       }
    //     }
    //   });
    // } catch (err) {
    //   Logger.log(err);
    // }
  }
}
