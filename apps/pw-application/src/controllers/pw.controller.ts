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
  @Get('/wallets/:userId')
  async wallets(@Param('userId') userId: string) {
    Logger.log('GET - wallets: userId');
    return await this.service.getWallets(Number(userId));
  }

  getUser(req: any) {
    return this.authService.getUserData(
      req.headers['authorization']?.split(' ')[1],
    );
  }

  @UseGuards(AuthGuard)
  @Get('/api/protected/transactions')
  async recent(@Request() req) {
    Logger.log('GET - /api/protected/transactions');
    const user = await this.getUser(req);
    return await this.service.getTransaction(user.id);
  }

  @UseGuards(AuthGuard)
  @Post('/api/protected/transactions')
  async send(@Body() data) {
    Logger.log(data);
    return await this.service.sendTransaction(data);
  }
}
