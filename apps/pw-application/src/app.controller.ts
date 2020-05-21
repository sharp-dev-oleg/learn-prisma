import { Controller, Get, Post, Body,Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/registration')
  registration(@Body() user) {
    return this.appService.registration(user);
  }

  @Post('/login')
  login(@Body() user) {
    return this.appService.login(user);
  }

  @Get('/userdata')
  user(@Request() req) {
    return this.appService.getUserData(req.headers['authorization']?.split(' ')[1]);
  }
}
