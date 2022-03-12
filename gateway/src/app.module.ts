import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './controllers/user.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UserController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.GET });
  }
}
