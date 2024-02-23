import { Wailet } from './models/Wailet';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './models/user.model';
import { Transaction } from './models/Transaction';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'database.env',
    }),
  ],
  providers: [PrismaService],
  exports: [
    PrismaService,
    TypeOrmModule.forFeature([UserModel, Transaction, Wailet]),
  ],
})
export class DatabaseModule {}
