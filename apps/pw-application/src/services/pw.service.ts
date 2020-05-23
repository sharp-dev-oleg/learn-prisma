import { Injectable, Inject, RequestTimeoutException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, throwError } from 'rxjs';
import {timeout,catchError} from 'rxjs/operators'

@Injectable()
export class PwService {
  
  constructor(
  @Inject('PW_CLIENT')
  private readonly client: ClientProxy,
  ) {}

 async getTransaction(userId) {
   Logger.log('getTransaction');
    return await this.client.send({ role: 'PW', cmd: 'recent' }, userId)
      .pipe(
        timeout(5000), 
        catchError(err => {
          Logger.log(err);
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }))
      .toPromise();
  }


  async getWailets(userId) {
    return await this.client.send({ role: 'PW', cmd: 'wailets' }, userId)
      .pipe(
        timeout(5000), 
        catchError(err => {
          Logger.log(err);
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }))
      .toPromise();
  }

  async sendTransaction(data) {
    return await this.client.send({ role: 'PW', cmd: 'transaction' }, data)
      .pipe(
        timeout(5000), 
        catchError(err => {
          Logger.log(err);
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }))
      .toPromise();
  }



}
