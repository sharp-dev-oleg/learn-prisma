import { Module } from '@nestjs/common';
import { PWController } from './pw.controller';
import { PWService } from './pw.service';
import { DatabaseModule } from 'libs/database/src';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [PWController],
  providers: [PWService],
})
export class PWModule {}
