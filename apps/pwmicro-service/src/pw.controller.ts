import { Controller, Get } from '@nestjs/common';
import { PWService } from './pw.service';

@Controller()
export class PWController {
  constructor(private readonly appService: PWService) {}

  @Get()
  getTransactions() {
    return this.appService.getTransactions(1);
  }
}
