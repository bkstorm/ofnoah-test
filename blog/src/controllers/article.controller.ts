import { Body, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreateArticleDTO } from '../interfaces/create-article.dto';
import { DeleteArticleResponseDto } from '../interfaces/delete-article-response.dto';
import { DeleteArticleDto } from '../interfaces/delete-article.dto';
import { UpsertArticleResponseDto } from '../interfaces/upsert-article-response.dto';
import { UpdateArticleDto } from '../interfaces/update-article.dto';
import { ArticleService } from '../services/article.service';
import { GetAllArticlesReponseDto } from '../interfaces/get-all-articles-response.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @MessagePattern('get_all_articles')
  async getAllArticles(): Promise<GetAllArticlesReponseDto> {
    try {
      const articles = await this.articleService.findAll();
      return {
        status: HttpStatus.OK,
        message: 'Success',
        articles,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        errors: error,
      };
    }
  }

  @MessagePattern('create_article')
  async createArticle(
    @Body() data: CreateArticleDTO,
  ): Promise<UpsertArticleResponseDto> {
    try {
      const article = await this.articleService.createArticle(data);
      return {
        status: HttpStatus.OK,
        message: 'Success',
        article,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        errors: error,
      };
    }
  }

  @MessagePattern('update_article')
  async updateArticle(
    @Body() data: UpdateArticleDto,
  ): Promise<UpsertArticleResponseDto> {
    const ability = this.caslAbilityFactory.createForUser({ uid: data.userId });
    try {
      const article = await this.articleService.findArticleById(data.id);
      if (!article) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Article not found',
        };
      }
      if (!ability.can(Action.Update, article)) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Access denied!',
        };
      }
      const updatedArticle = await this.articleService.updateArticle(data);
      return {
        status: HttpStatus.OK,
        message: 'Success',
        article: updatedArticle,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @MessagePattern('delete_article')
  async deleteArticle(
    @Body() data: DeleteArticleDto,
  ): Promise<DeleteArticleResponseDto> {
    const ability = this.caslAbilityFactory.createForUser({ uid: data.userId });
    try {
      const article = await this.articleService.findArticleById(data.id);
      if (!article) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Article not found',
        };
      }
      if (!ability.can(Action.Delete, article)) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Access denied!',
        };
      }
      await this.articleService.deleteArticle(data.id);
      return {
        status: HttpStatus.OK,
        message: 'Success',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }
}
