import { Wailet } from './models/Wailet';
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserModel} from './models/user.model';
import { Transaction } from './models/Transaction';
@Module({
  imports:[
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'freshekt',
      password: 'f30122784',
      database: 'pwdatabase',
      entities: [UserModel, Transaction, Wailet],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserModel, Transaction, Wailet])
  ],
  providers: [DatabaseService],
  exports: [DatabaseService,TypeOrmModule.forFeature([UserModel, Transaction, Wailet])],
})
export class DatabaseModule {}
