import { Controller, UseGuards, Query, Post, Logger } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(AuthGuard)
  @Post('/api/protected/users/list')
  search(@Query('q') q) {
    Logger.log(`UserController:search`, { q });
    return this.service.search(q);
  }
}
