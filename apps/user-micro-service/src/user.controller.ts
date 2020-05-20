import { IUser } from './user.interface';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getByUserName(data){
    return await this.service.getByUsername(data);
  }
}
