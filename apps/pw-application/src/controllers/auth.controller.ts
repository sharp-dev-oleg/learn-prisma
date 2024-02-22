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

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/registration')
  registration(@Body() user) {
    return this.service.registration(user);
  }

  @Post('/login')
  login(@Body() user) {
    return this.service.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('/userdata')
  user(@Request() req) {
    return this.service.getUserData(
      req.headers['authorization']?.split(' ')[1],
    );
  }
}
