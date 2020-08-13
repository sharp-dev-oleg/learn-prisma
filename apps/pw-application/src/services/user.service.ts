import { Injectable, Inject, RequestTimeoutException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, throwError } from 'rxjs';
import {timeout,catchError} from 'rxjs/operators'

@Injectable()
export class UserService {
  
  constructor(
  @Inject('USER_CLIENT')
  private readonly userClient: ClientProxy
  ) {}

 async create(data) {
  Logger.log('create',data)
    return await this.userClient.send({ role: 'user', cmd: 'create' }, data)
      .pipe(
        timeout(15000), 
        catchError(err => {
          Logger.log(err);
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }))
      .toPromise();
  }

  async search(query) {
      Logger.log(`query:${query}`);
    return await this.userClient.send({ role: 'user', cmd: 'search' }, query)
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
