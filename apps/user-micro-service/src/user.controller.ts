import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getByUserName(data: string) {
    try {
      Logger.log('UserController:getByUserName');
      Logger.log(data);
      const resultUser = await this.service.getByUsername(data);
      Logger.log(resultUser);
      return resultUser;
    } catch (e) {
      Logger.log(e);
    }
  }

  @MessagePattern({ role: 'user', cmd: 'search' })
  search(query) {
    Logger.log('role:user;cmd:search', { query });
    return this.service.search(query);
  }

  @MessagePattern({ role: 'user', cmd: 'create' })
  createUser(data) {
    Logger.log('create', data);
    return this.service.create(data);
  }
}
