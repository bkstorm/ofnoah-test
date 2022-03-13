import { Injectable } from '@nestjs/common';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigService {
  private serviceOptions: {
    userServiceOptions: ClientOptions;
    blogServiceOptions: ClientOptions;
  };

  constructor() {
    this.serviceOptions = {
      userServiceOptions: {
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST,
          port: +process.env.USER_SERVICE_PORT,
        },
      },
      blogServiceOptions: {
        transport: Transport.TCP,
        options: {
          host: process.env.BLOG_SERVICE_HOST,
          port: +process.env.BLOG_SERVICE_PORT,
        },
      },
    };
  }

  getServiceOptions() {
    return this.serviceOptions;
  }
}
