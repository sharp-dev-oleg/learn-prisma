import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTransactions(): string {
    return 'Hello World!';
  }
}
