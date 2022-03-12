import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controllers/user.controller';
import { UserProfile } from './entities/user-profile.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ofnoah',
      password: '123456aA',
      database: 'ofnoah',
      entities: [UserProfile],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserProfile]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
