import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getByUserName(data) {
    try {
      Logger.log('getByUserName');
      Logger.log(data);
      const resultUser = await this.service.search(data);
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
  async createUser(data) {
    Logger.log('create', data);
    return true;
    //return await this.service.createUser(data);
  }
}
