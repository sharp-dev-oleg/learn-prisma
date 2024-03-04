import { Transaction } from './../../../libs/database/src/models/Transaction';
import { Controller, Logger } from '@nestjs/common';
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
  sendTransaction(data: Transaction) {
    Logger.log(data);
    return this.service.send(data);
  }

  @MessagePattern({ role: 'PW', cmd: 'wallets' })
  getWallets(userId) {
    return this.service.getWallets(userId);
  }

  @MessagePattern({ role: 'PW', cmd: 'wallet' })
  getWallet(id) {
    return this.service.getWallet(id);
  }
}
