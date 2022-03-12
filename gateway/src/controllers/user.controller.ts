import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../interfaces/user';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('hello')
  hello(@CurrentUser() user: User): string {
    return `Hello ${user.email}`;
  }
}
