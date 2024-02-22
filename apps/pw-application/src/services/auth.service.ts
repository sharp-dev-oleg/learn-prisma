import {
  Injectable,
  Inject,
  RequestTimeoutException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, throwError } from 'rxjs';
import { timeout, catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject('AUTH_CLIENT')
    private readonly authClient: ClientProxy,
  ) {}

  async registration(data) {
    return await this.userService.create(data);
  }

  async login(data) {
    Logger.log(data);
    return await this.authClient
      .send({ role: 'auth', cmd: 'signin' }, data)
      .pipe(
        timeout(5000),
        tap((response) => {
          if (response == null)
            throw new HttpException(
              'User with given credentials not found',
              HttpStatus.NOT_FOUND,
            );
        }),
        catchError((err) => {
          Logger.log(err);
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),
      )
      .toPromise();
  }

  async getUserData(jwt: string) {
    return await this.authClient
      .send({ role: 'auth', cmd: 'get' }, { jwt })
      .pipe(
        timeout(5000),
        tap((userdata) => Logger.log({ userdata })),
        catchError((err) => {
          Logger.log(err);
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),
      )
      .toPromise();
  }
}
