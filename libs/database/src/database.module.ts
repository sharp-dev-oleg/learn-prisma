import { Wailet } from './models/Wailet';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserModel} from './models/user.model';
import { Transaction } from './models/Transaction';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      envFilePath: 'database.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT,10)||5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserModel, Transaction, Wailet],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserModel, Transaction, Wailet])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService,TypeOrmModule.forFeature([UserModel, Transaction, Wailet])],
})
export class DatabaseModule {}
