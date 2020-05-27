import { Module } from '@nestjs/common';
import { PWController } from './pw.controller';
import { PWService } from './pw.service';
import { DatabaseModule } from 'libs/database/src';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['database.env','.env']}),
    DatabaseModule,
    ScheduleModule.forRoot()
  ],
  controllers: [PWController],
  providers: [PWService],
})
export class PWModule {}
