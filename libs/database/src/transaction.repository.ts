import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Wallet, Transaction } from '@prisma/client';
import * as moment from 'moment/moment';

export type NewTransactionType = Pick<
  Transaction,
  'fromWalletId' | 'toWalletId' | 'amount'
>;

@Injectable()
export class TransactionRepository {
  private transactionClient: Prisma.TransactionDelegate;
  constructor(private prisma: PrismaService) {
    this.transactionClient = this.prisma.transaction;
  }

  findAllTransactions(walletIds: Wallet['id'][]) {
    return this.transactionClient.findMany({
      where: {
        OR: [
          { fromWalletId: { in: walletIds } },
          { toWalletId: { in: walletIds } },
        ],
      },
    });
  }

  findNew() {
    return this.transactionClient.findMany({
      where: {
        status: 'New',
      },
    });
  }

  create(newTransaction: NewTransactionType) {
    return this.transactionClient.create({
      data: {
        ...newTransaction,
        status: 'NEW',
        date: moment().toDate(),
        fromBalance: 0,
        toBalance: 0,
      },
    });
  }
}
