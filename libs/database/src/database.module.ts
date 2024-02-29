import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@app/database/user.repository';
import { TransactionRepository } from '@app/database/transaction.repository';
import { WalletRepository } from '@app/database/wallet.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'database.env',
    }),
  ],
  providers: [
    PrismaService,
    UserRepository,
    TransactionRepository,
    WalletRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    TransactionRepository,
    WalletRepository,
  ],
})
export class DatabaseModule {}
