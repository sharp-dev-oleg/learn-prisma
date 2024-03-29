import { Controller, Logger } from '@nestjs/common';
import { PWService } from './pw.service';
import { MessagePattern } from '@nestjs/microservices';
import type { Transaction, User } from '@prisma/client';

@Controller()
export class PWController {
  constructor(private readonly service: PWService) {}

  @MessagePattern({ role: 'PW', cmd: 'recent' })
  getRecentTransactions(userId: User['id']) {
    return this.service.getTransactions(userId);
  }

  @MessagePattern({ role: 'PW', cmd: 'transaction' })
  sendTransaction(data: Transaction) {
    Logger.log(data);
    return this.service.send(data);
  }

  @MessagePattern({ role: 'PW', cmd: 'wallets' })
  getWallets(userId: number) {
    return this.service.getWallets(userId);
  }

  @MessagePattern({ role: 'PW', cmd: 'wallet' })
  getWallet(id: number) {
    return this.service.getWallet(id);
  }
}
