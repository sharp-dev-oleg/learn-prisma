import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'libs/database/src';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['database.env', '.env']}),
    DatabaseModule
 ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
