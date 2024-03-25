import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Wallet, Transaction, PrismaClient } from '@prisma/client';
import * as moment from 'moment/moment';
import { BaseRepository } from '@app/database/baseRepository';

export type NewTransactionType = Pick<
  Transaction,
  'fromWalletId' | 'toWalletId' | 'amount'
>;

@Injectable()
export class TransactionRepository extends BaseRepository<Prisma.TransactionDelegate> {
  constructor(prisma: PrismaService) {
    super(prisma, 'transaction');
  }

  findAllTransactions(walletIds: Wallet['id'][], tx?: PrismaClient) {
    const includeWallet = {
      select: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    };
    return this.getClient(tx).findMany({
      include: {
        toWallet: includeWallet,
        fromWallet: includeWallet,
      },
      where: {
        OR: [
          { fromWalletId: { in: walletIds } },
          { toWalletId: { in: walletIds } },
        ],
      },
    });
  }

  findNew(tx?: PrismaClient) {
    return this.getClient(tx).findMany({
      where: {
        status: 'NEW',
      },
    });
  }

  create(newTransaction: NewTransactionType, tx?: PrismaClient) {
    return this.getClient(tx).create({
      data: {
        ...newTransaction,
        status: 'NEW',
        date: moment().toDate(),
        fromBalance: 0,
        toBalance: 0,
      },
    });
  }

  update(
    id: Transaction['id'],
    transaction: Prisma.TransactionUpdateInput,
    tx?: PrismaClient,
  ) {
    return this.getClient(tx).update({
      data: transaction,
      where: {
        id,
      },
    });
  }
}
