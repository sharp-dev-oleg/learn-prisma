import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wailet } from '../../../libs/database/src/models/Wailet';
import { Transaction } from '../../../libs/database/src/models/Transaction';
import { Cron, CronExpression,SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class PWService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wailet)
    private wailetRepository: Repository<Wailet>,
    private scheduler:SchedulerRegistry
  ) {}

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

  async send(transaction: Transaction) {
    transaction.status = 'NEW';
    const entity = this.transactionRepository.create(transaction);
    await this.transactionRepository.insert(entity);
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
          await tmanager.save(transaction);
          const fromWailet = await this.wailetRepository.findOne({
            id: transaction.fromWailetId,
          });
          const toWailet = await this.wailetRepository.findOne({
            id: transaction.toWailetId,
          });

          if (fromWailet.balance < transaction.amount ) {
            transaction.status = 'FAILED';
            await tmanager.save(transaction);
          } else {
          await this.wailetRepository.manager.transaction(async (wmanager:EntityManager) => {
              fromWailet.balance -= transaction.amount;
              toWailet.balance += transaction.amount;
              wmanager.save(fromWailet);
              wmanager.save(toWailet);
            });
            transaction.status = 'COMPLETE';
            await tmanager.save(transaction);
          }
        }
      });
    } catch (err) {
      Logger.log(err);
    }
  }
}
