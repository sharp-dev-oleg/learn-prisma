import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { getClientPipeOperatorsWithTap } from '@app/utils/pipe';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject('AUTH_CLIENT')
    private readonly authClient: ClientProxy,
  ) {}

  registration(data) {
    return this.userService.create(data);
  }

  login(data) {
    Logger.log('AuthSerive:login', data);
    return this.authClient.send({ role: 'auth', cmd: 'signin' }, data).pipe(
      ...getClientPipeOperatorsWithTap(
        tap((response) => {
          if (response == null)
            throw new HttpException(
              'User with given credentials not found',
              HttpStatus.NOT_FOUND,
            );
        }),
      ),
    );
  }

  async getUserData(jwt: string) {
    return firstValueFrom(
      this.authClient
        .send({ role: 'auth', cmd: 'get' }, { jwt })
        .pipe(
          ...getClientPipeOperatorsWithTap(
            tap((userdata) => Logger.log({ userdata })),
          ),
        ),
    );
  }
}
