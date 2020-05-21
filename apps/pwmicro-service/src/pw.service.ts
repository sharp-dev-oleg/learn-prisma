import { NotInufMoneyError } from './errors/NotInufMoneyError';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wailet } from 'libs/database/src/models/Wailet';
import { Transaction } from 'libs/database/src/models/Transaction';

@Injectable()
export class PWService {

  constructor(  
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wailet)
    private wailetRepository: Repository<Wailet>
   ){}

   async getTransactions(userId: number) {
    return this.transactionRepository.find({where:`fromWailetId in (select id from wailet where userId=${userId}) or toWailetId in (select id from wailet where userId=${userId})`})
   }

   async getWailets(userId: number) {
     return this.wailetRepository.find({userId});
   }

  async send(transaction: Transaction) {
    const fromWailet = await this.wailetRepository.findOne({id:transaction.fromWailetId});
    
    transaction.status = 'NEW';
    if(fromWailet.balance < transaction.anount){
      transaction.status = 'FAILED';
      throw new NotInufMoneyError();
    }

    const entity = this.transactionRepository.create(transaction);
    await this.transactionRepository.insert(entity);
  }
}
