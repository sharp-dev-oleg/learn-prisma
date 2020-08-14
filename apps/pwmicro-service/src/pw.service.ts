import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wailet } from '@app/database/models/Wailet';
import { Transaction } from '@app/database/models/Transaction';
import * as moment from 'moment';
import {  CronExpression,SchedulerRegistry } from '@nestjs/schedule';
import * as io from "socket.io-client";
import { CronJob } from 'cron';
import { UserModel } from '@app/database/models/user.model';
@Injectable()
export class PWService {
  ws: any;
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wailet)
    private wailetRepository: Repository<Wailet>,
    private scheduler:SchedulerRegistry
  ) {

   this.ws = io.connect("http://192.168.1.65:3000", {transports:["websocket"]});
   
  }

  async getTransactions(userId: number) {
    const wailetIds = (
      await this.wailetRepository
        .createQueryBuilder('wailet')
        .select('id')
        .where('wailet.user_id = :userId', { userId })
        .getRawMany()
    ).map(s => s.id);
    return await this.transactionRepository
      .createQueryBuilder()
      .where(`from_wailet_id In (:...wailetIds)`, { wailetIds })
      .orWhere(`to_wailet_id In (:...wailetIds)`, { wailetIds })
      .getMany();
  }

  async getWailets(userId: number) {
    return this.wailetRepository.find({ userId });
  }

  async getWailet(id: number) {
    return this.wailetRepository.findOne({ id });
  }

  async send(transaction: Transaction) {
    transaction.status = 'NEW';
    transaction.date = moment().toDate();
    transaction.fromBalance = 0;
    transaction.toBalance = 0;
    const entity = this.transactionRepository.create(transaction);
    const result =  await this.transactionRepository.insert(entity);
    transaction.id = result.identifiers[0].id;
    this.ws.emit('update_transaction', transaction);
    return transaction;
  }
  
  addCronJob(){
     const job = new CronJob(CronExpression.EVERY_MINUTE,()=>this.process());
     this.scheduler.addCronJob('pw-proccess', job);
     job.start();
  }

  //@Cron(CronExpression.EVERY_MINUTE)
  async process() {
    try {
   await this.transactionRepository.manager.transaction(async tmanager => {
        const transactions = await tmanager.find(Transaction, {
          status: 'NEW',
        });
        for (const transaction of transactions) {
          transaction.status = 'PENDING';
          this.ws.emit('update_transaction', transaction);
          await tmanager.save(transaction);
          const fromWailet = await this.wailetRepository.findOne({
            id: transaction.fromWailetId,
          });
          const toWailet = await this.wailetRepository.findOne({
            id: transaction.toWailetId,
          });

          if (fromWailet.balance < transaction.amount ) {
            transaction.status = 'FAILED';
            this.ws.emit('update_transaction', transaction);
            await tmanager.save(transaction);
          } else {
          await this.wailetRepository.manager.transaction(async (wmanager: EntityManager) => {
              fromWailet.balance = parseFloat(fromWailet.balance.toString()) - parseFloat(transaction.amount.toString());
              toWailet.balance = parseFloat(toWailet.balance.toString()) + parseFloat(transaction.amount.toString());
              transaction.fromBalance = fromWailet.balance;
              transaction.toBalance = toWailet.balance;
              this.ws.emit('update_wailet', fromWailet);
              this.ws.emit('update_wailet', toWailet);
              wmanager.save(fromWailet);
              wmanager.save(toWailet);
            });
            transaction.status = 'COMPLETE';
            this.ws.emit('update_transaction', transaction);
            await tmanager.save(transaction);
          }
        }
      });
    } catch (err) {
      Logger.log(err);
    }
  }
}
