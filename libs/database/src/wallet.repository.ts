import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}
}
