import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ role: 'auth', cmd: 'signin' })
  async login(user: User) {
    Logger.log('AuthController:login', user);
    try {
      const curuser = await this.authService.validateUser(
        user.username,
        user.password,
      );
      return this.authService.login(curuser);
    } catch (e) {
      return e.message;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async isLoggedIn(data) {
    try {
      const res = this.authService.validateToken(data.jwt);

      return res;
    } catch (e) {
      Logger.log(e);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'get' })
  getUserData(data): any {
    try {
      const res = this.authService.getUserData(data.jwt);

      return res;
    } catch (e) {
      Logger.log(e);
      return false;
    }
  }
}
