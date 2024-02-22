import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Logger,
  Param,
} from '@nestjs/common';
import { PwService } from '../services/pw.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@Controller()
export class PWController {
  constructor(
    private readonly service: PwService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/recent')
  async recent(@Request() req) {
    Logger.log('GET - recent');
    const user = await this.getUser(req);
    return await this.service.getTransaction(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('/wailets/:userId')
  async wailets(@Param('userId') userId) {
    Logger.log('GET - wailets: userId');
    return await this.service.getWailets(userId);
  }

  getUser(req: any) {
    return this.authService.getUserData(
      req.headers['authorization']?.split(' ')[1],
    );
  }

  @UseGuards(AuthGuard)
  @Post('/send')
  async send(@Body() data) {
    Logger.log(data);
    return await this.service.sendTransaction(data);
  }
}
