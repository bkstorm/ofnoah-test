import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';

import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { DeleteArticleResponseDto } from '../interfaces/dto/delete-article-response.dto';
import { GetAllArticlesResponseDto } from '../interfaces/dto/get-all-articles-response.dto';
import { UpsertArticleDtoResponse } from '../interfaces/dto/upsert-article-response.dto';
import { UpsertArticleDto } from '../interfaces/dto/upsert-article.dto';
import { ServiceBlogDeleteArticleResponse } from '../interfaces/service-blog-delete-article-response';
import { ServiceBlogGetAllArticlesResponse } from '../interfaces/service-blog-get-all-articles-response';
import { ServiceBlogUpsertArticleResponse } from '../interfaces/service-blog-upsert-article-response';
import { User } from '../interfaces/user';
import { Article } from '../interfaces/dto/article';
import { BaseResponseDto } from '../interfaces/dto/base-response.dto';

@Controller('articles')
@ApiExtraModels(GetAllArticlesResponseDto, Article, BaseResponseDto)
export class BlogController {
  constructor(@Inject('BLOG_SERVICE') private blogClient: ClientProxy) {}

  @Get()
  @ApiOkResponse({
    description: 'All articles have been successfully fetched.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(GetAllArticlesResponseDto) },
        {
          properties: {
            articles: {
              type: 'array',
              items: { $ref: getSchemaPath(Article) },
            },
          },
        },
      ],
    },
  })
  async getAll(): Promise<GetAllArticlesResponseDto> {
    const getAllArticlesResponse: ServiceBlogGetAllArticlesResponse =
      await firstValueFrom(this.blogClient.send('get_all_articles', {}));
    if (getAllArticlesResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getAllArticlesResponse.message,
        },
        getAllArticlesResponse.status,
      );
    }
    return {
      message: getAllArticlesResponse.message,
      data: {
        articles: getAllArticlesResponse.articles,
      },
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The article has been successfully created.',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(BaseResponseDto),
        },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                article: {
                  $ref: getSchemaPath(Article),
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'Firebase Authentication idToken is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error happended',
  })
  async createArticle(
    @Body() data: UpsertArticleDto,
    @CurrentUser() user: User,
  ): Promise<UpsertArticleDtoResponse> {
    const createArticleReponse: ServiceBlogUpsertArticleResponse =
      await firstValueFrom(
        this.blogClient.send('create_article', { ...data, userId: user.uid }),
      );
    if (createArticleReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: createArticleReponse.message,
          errors: createArticleReponse.errors,
        },
        createArticleReponse.status,
      );
    }
    return {
      message: createArticleReponse.message,
      data: {
        article: createArticleReponse.article,
      },
    };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Article ID need to be updated',
    type: Number,
  })
  @ApiOkResponse({
    description: 'The article has been successfully created.',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(BaseResponseDto),
        },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                article: {
                  $ref: getSchemaPath(Article),
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiForbiddenResponse({
    description:
      'Firebase Authentication idToken is invalid or user is not the owner of the article',
  })
  @ApiNotFoundResponse({
    description: 'The article does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error happended',
  })
  async updateArticle(
    @Body() data: UpsertArticleDto,
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<UpsertArticleDtoResponse> {
    const updateArticleResponse: ServiceBlogUpsertArticleResponse =
      await firstValueFrom(
        this.blogClient.send('update_article', {
          ...data,
          id: +id,
          userId: user.uid,
        }),
      );
    if (updateArticleResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateArticleResponse.message,
          data: null,
          errors: updateArticleResponse.errors,
        },
        updateArticleResponse.status,
      );
    }
    return {
      message: updateArticleResponse.message,
      data: {
        article: updateArticleResponse.article,
      },
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    description: 'Article ID need to be deleted',
    type: Number,
  })
  @ApiOkResponse({
    description: 'The article has been successfully created.',
    type: DeleteArticleResponseDto,
  })
  @ApiForbiddenResponse({
    description:
      'Firebase Authentication idToken is invalid or user is not the owner of the article',
  })
  @ApiNotFoundResponse({
    description: 'The article does not exist',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error happended',
  })
  async deleteArticle(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<DeleteArticleResponseDto> {
    const deleteArticleResponse: ServiceBlogDeleteArticleResponse =
      await firstValueFrom(
        this.blogClient.send('delete_article', {
          id: +id,
          userId: user.uid,
        }),
      );
    if (deleteArticleResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteArticleResponse.message,
          errors: deleteArticleResponse.errors,
        },
        deleteArticleResponse.status,
      );
    }
    return {
      message: deleteArticleResponse.message,
    };
  }
}
