import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './user.model';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    database: 'pwnodebd',
    entities: [UserModel],
    synchronize: true,
  })],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
