import { IUser } from './../../../libs/database/src/models/user.interface';
import { Controller, UseGuards, Post,Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 
  @MessagePattern({ role: 'auth', cmd: 'signin'})
  async login(user: IUser) {
    const curuser = await this.authService.validateUser(user.username,user.password);
    if(curuser === null)
     throw new Error('Unauthorized');

    return this.authService.login(curuser);
  }

  @MessagePattern({ role: 'auth', cmd: 'check'})
  async isLoggedIn(data) {
    try {
      const res = this.authService.validateToken(data.jwt);

      return res;
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'get'})
  getUserData(data){
    try {
      const res = this.authService.getUserData(data.jwt);

      return res;
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }
}
