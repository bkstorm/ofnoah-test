import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';

import { UserController } from './controllers/user.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.getUserServiceOptions());
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
