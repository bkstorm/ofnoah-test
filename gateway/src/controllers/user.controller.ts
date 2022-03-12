import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class UserController {
  @Get('hello')
  hello(@Req() req: Request): string {
    return `Hello ${req['user'].email}`;
  }
}
