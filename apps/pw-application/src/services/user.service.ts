import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly userClient: ClientProxy,
  ) {}

  async create(data) {
    Logger.log('create', data);
    return this.userClient.send({ role: 'user', cmd: 'create' }, data);
  }

  async search(query) {
    return this.userClient.send({ role: 'user', cmd: 'search' }, query);
  }
}
