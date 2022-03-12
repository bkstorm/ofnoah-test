import { Injectable } from '@nestjs/common';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigService {
  getUserServiceOptions(): ClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST,
        port: +process.env.USER_SERVICE_PORT,
      },
    };
  }
}
