import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getByUserName(data){
    return await this.service.getByUsername(data);
  }


  @MessagePattern({ role: 'user', cmd: 'search' })
  async search(query){
    return await this.service.search(query);
  }

  @MessagePattern({ role: 'user', cmd: 'create' })
  async createUser(data){
    Logger.log('create',data)
    return await this.service.createUser(data);
  }
}
