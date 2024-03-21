import {
  Controller,
  UseGuards,
  Query,
  Post,
  Logger,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/users')
  registration(@Body() user) {
    return this.service.create(user);
  }

  @UseGuards(AuthGuard)
  @Post('/api/protected/users/list')
  search(@Query('q') q) {
    Logger.log(`UserController:search`, { q });
    return this.service.search(q);
  }
}
