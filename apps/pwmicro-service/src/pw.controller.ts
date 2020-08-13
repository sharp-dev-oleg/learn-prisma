import { Transaction } from './../../../libs/database/src/models/Transaction';
import { Controller, Get, Logger } from '@nestjs/common';
import { PWService } from './pw.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PWController {

  constructor(private readonly service: PWService) {}

  @MessagePattern({ role: 'PW', cmd: 'recent' })
  getTransactions(userId) {
    return this.service.getTransactions(userId);
  }

  @MessagePattern({ role: 'PW', cmd: 'transaction' })
  sendTransaction(data:Transaction) {
    Logger.log(data);
    return this.service.send(data);
  }

  @MessagePattern({ role: 'PW', cmd: 'wailets' })
  getWailets(userId) {
    return this.service.getWailets(userId);
  }

  @MessagePattern({ role: 'PW', cmd: 'wailet' })
  getWailet(id) {
    return this.service.getWailet(id);
  }
}
