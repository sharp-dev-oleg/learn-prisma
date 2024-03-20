import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { NewTransactionType } from '@app/database/transaction.repository';
import { getClientPipeOperators } from '@app/utils/pipe';
import { Wallet } from '@prisma/client';

@Injectable()
export class PwService {
  constructor(
    @Inject('PW_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async getTransaction(userId) {
    Logger.log('getTransaction');
    return firstValueFrom(
      this.client
        .send({ role: 'PW', cmd: 'recent' }, userId)
        .pipe(...getClientPipeOperators()),
    );
  }

  async getWallets(userId: number) {
    return firstValueFrom(
      this.client
        .send({ role: 'PW', cmd: 'wallets' }, userId)
        .pipe(...getClientPipeOperators()),
    );
  }

  async getWallet(id: number) {
    return firstValueFrom(
      this.client
        .send({ role: 'PW', cmd: 'wallet' }, id)
        .pipe(...getClientPipeOperators()) as Observable<Wallet>,
    );
  }

  async sendTransaction(transactionData: NewTransactionType) {
    return firstValueFrom(
      this.client
        .send({ role: 'PW', cmd: 'transaction' }, transactionData)
        .pipe(...getClientPipeOperators()),
    );
  }
}
