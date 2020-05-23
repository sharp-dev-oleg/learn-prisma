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
  sendTransaction(data) {
    return this.service.send(data);
  }

  @MessagePattern({ role: 'PW', cmd: 'wailets' })
  getWailets(userId) {
    return this.service.getWailets(userId);
  }
}
