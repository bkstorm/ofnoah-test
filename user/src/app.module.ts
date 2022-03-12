import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './controllers/user.controller';
import { UserProfile } from './entities/user-profile.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserProfile],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserProfile]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
