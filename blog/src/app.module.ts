import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Blog } from './entities/blog.entity';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';

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
      entities: [Blog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Blog]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class AppModule {}
