import {
  Injectable,
  Inject,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { TimeoutError, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
  @Client({ transport: Transport.TCP })
  private readonly userClient: ClientProxy;
  // constructor(
  //   //@Inject('USER_CLIENT')
  //
  //
  // ) {}

  async onApplicationBootstrap() {
    await this.userClient.connect();
  }

  async create(data) {
    Logger.log('create', data);
    return this.userClient
      .send({ role: 'user', cmd: 'create' }, data);
      // .pipe(
      //   timeout(15000),
      //   catchError((err) => {
      //     Logger.log(err);
      //     if (err instanceof TimeoutError) {
      //       return throwError(new RequestTimeoutException());
      //     }
      //     return throwError(err);
      //   }),
      // );
  }

  async search(query) {
    Logger.log(`query:${query}`);
    return this.userClient
      .send({ role: 'user', cmd: 'search' }, query);
      // .pipe(
      //   timeout(5000),
      //   catchError((err) => {
      //     Logger.log(err);
      //     console.log('err', err);
      //     if (err instanceof TimeoutError) {
      //       return throwError(new RequestTimeoutException());
      //     }
      //     return throwError(err);
      //   }),
      // );
  }
}
