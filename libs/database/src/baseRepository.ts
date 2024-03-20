import { PrismaService } from '@app/database/prisma.service';
import type { PrismaClient } from '@prisma/client';

export class BaseRepository<T> {
  private client: T;
  constructor(
    protected prisma: PrismaService,
    protected key: string,
  ) {
    this.client = this.prisma[key];
  }
  getClient(transactionClient?: PrismaClient): T {
    return transactionClient?.[this.key] ?? this.client;
  }
}
