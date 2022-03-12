import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard)
  @Get('hello')
  hello(@Req() req: Request): string {
    return `Hello ${req['user'].email}`;
  }
}
