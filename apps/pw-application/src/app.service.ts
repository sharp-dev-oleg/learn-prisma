import { Injectable, Inject, RequestTimeoutException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, throwError } from 'rxjs';
import {timeout,catchError} from 'rxjs/operators'

@Injectable()
export class AppService {
  
  constructor(
  @Inject('USER_CLIENT')
  private readonly userClient: ClientProxy,
  @Inject('AUTH_CLIENT')
  private readonly authClient: ClientProxy
  ) {}

 async registration(data) {
    return await this.userClient.send({ role: 'user', cmd: 'create' }, data)
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

  async login(data) {
    return await this.authClient.send({ role: 'auth', cmd: 'signin'}, data)
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

  async getUserData(jwt: string) {
    const {user:{id,username},exp} = await this.authClient.send({ role: 'auth', cmd: 'get'}, {jwt})
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

      return {id,username,exp};
  }

}
