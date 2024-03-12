import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import type { Prisma, Wallet } from '@prisma/client';

@Injectable()
export class WalletRepository {
  private walletClient: Prisma.WalletDelegate;
  constructor(private prisma: PrismaService) {
    this.walletClient = this.prisma.wallet;
  }

  async create(walletData: Prisma.WalletCreateArgs['data']) {
    return this.walletClient.create({ data: walletData });
  }

  findByUserId(userId: Wallet['userId']) {
    return this.walletClient.findMany({ where: { userId } });
  }

  getById(id: Wallet['id']) {
    return this.walletClient.findFirst({ where: { id } });
  }

  update(id: Wallet['id'], wallet: Prisma.WalletUpdateInput) {
    return this.walletClient.update({
      data: wallet,
      where: {
        id,
      },
    });
  }
}
