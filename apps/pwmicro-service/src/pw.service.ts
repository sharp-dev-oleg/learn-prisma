import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wailet } from '../../../libs/database/src/models/Wailet';
import { Transaction } from '../../../libs/database/src/models/Transaction';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PWService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wailet)
    private wailetRepository: Repository<Wailet>,
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

  @Cron(CronExpression.EVERY_MINUTE)
  async process() {
    try {
      this.transactionRepository.manager.transaction(async tmanager => {
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
            this.wailetRepository.manager.transaction(async wmanager => {
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
