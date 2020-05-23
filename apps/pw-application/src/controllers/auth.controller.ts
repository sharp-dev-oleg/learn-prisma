import { Controller, Get, Post, Body, Request, Logger, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('/registration')
  registration(@Body() user) {
    return this.appService.registration(user);
  }

  @Post('/login')
  login(@Body() user) {
    return this.appService.login(user);
  }

  @UseGuards(AuthGuard)
  @Get('/userdata')
  user(@Request() req) {
    
    return this.appService.getUserData(req.headers['authorization']?.split(' ')[1]);
  }
}
