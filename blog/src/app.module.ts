import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from './entities/article.entity';
import { ArticleController } from './controllers/article.controller';
import { ArticleService } from './services/article.service';
import { CaslAbilityFactory } from './casl/casl-ability.factory';

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
      entities: [Article],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, CaslAbilityFactory],
})
export class AppModule {}
