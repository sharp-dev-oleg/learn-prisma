import { Module } from '@nestjs/common';
import { PWController } from './pw.controller';
import { PWService } from './pw.service';
import { DatabaseModule } from 'libs/database/src';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot()
  ],
  controllers: [PWController],
  providers: [PWService],
})
export class PWModule {}
