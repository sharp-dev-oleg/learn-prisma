import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '@prisma/client';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/users')
  registration(@Body() user) {
    return this.service.registration(user);
  }

  @Post('/sessions/create')
  login(@Body() user) {
    return this.service.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('/api/protected/user-info')
  userInfo(@Request() req) {
    return this.service.getUserData(
      req.headers['authorization']?.split(' ')[1],
    );
  }
}
