import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, PrismaClient, Wallet } from '@prisma/client';
import { BaseRepository } from '@app/database/baseRepository';

@Injectable()
export class WalletRepository extends BaseRepository<Prisma.WalletDelegate> {
  constructor(prisma: PrismaService) {
    super(prisma, 'wallet');
  }

  async create(walletData: Prisma.WalletCreateArgs['data'], tx?: PrismaClient) {
    return this.getClient(tx).create({ data: walletData });
  }

  findByUserId(userId: Wallet['userId'], tx?: PrismaClient) {
    return this.getClient(tx).findMany({ where: { userId } });
  }

  getById(id: Wallet['id'], tx?: PrismaClient) {
    return this.getClient(tx).findFirst({ where: { id } });
  }

  update(
    id: Wallet['id'],
    wallet: Prisma.WalletUpdateInput,
    tx?: PrismaClient,
  ) {
    return this.getClient(tx).update({
      data: wallet,
      where: {
        id,
      },
    });
  }
}
