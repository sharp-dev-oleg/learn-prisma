import { Controller, UseGuards, Query, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/search')
  search(@Query('q') q) {
    return this.service.search(q);
  }
}
