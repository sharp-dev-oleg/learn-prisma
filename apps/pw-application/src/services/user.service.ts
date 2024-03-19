import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PublicUser } from '@app/types/user';
import { getClientPipeOperators } from '@app/utils/pipe';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly userClient: ClientProxy,
  ) {}

  create(data) {
    Logger.log('create', data);
    return this.userClient
      .send<PublicUser>({ role: 'user', cmd: 'create' }, data)
      .pipe(...getClientPipeOperators());
  }

  search(query) {
    return this.userClient
      .send<PublicUser[]>({ role: 'user', cmd: 'search' }, query)
      .pipe(...getClientPipeOperators());
  }
}
