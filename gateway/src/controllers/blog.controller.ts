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
import { DeleteBlogResponseDto } from '../interfaces/dto/delete-blog-response.dto';
import { GetAllBlogsResponseDto } from '../interfaces/dto/get-all-blogs-response.dto';
import { UpsertBlogDtoResponse } from '../interfaces/dto/upsert-blog-response.dto';
import { UpsertBlogDto } from '../interfaces/dto/upsert-blog.dto';
import { ServiceBlogDeleteResponse } from '../interfaces/service-blog-delete-response';
import { ServiceBlogGetAllResponse } from '../interfaces/service-blog-get-all-response';
import { ServiceBlogUpsertResponse } from '../interfaces/service-blog-upsert-response';
import { User } from '../interfaces/user';
import { Blog } from '../interfaces/dto/blog';
import { BaseResponseDto } from '../interfaces/dto/base-response.dto';

@Controller('articles')
@ApiExtraModels(GetAllBlogsResponseDto, Blog, BaseResponseDto)
export class BlogController {
  constructor(@Inject('BLOG_SERVICE') private blogClient: ClientProxy) {}

  @Get()
  @ApiOkResponse({
    description: 'All articles have been successfully fetched.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(GetAllBlogsResponseDto) },
        {
          properties: {
            blogs: {
              type: 'array',
              items: { $ref: getSchemaPath(Blog) },
            },
          },
        },
      ],
    },
  })
  async getAll(): Promise<GetAllBlogsResponseDto> {
    const getAllBlogsResponse: ServiceBlogGetAllResponse = await firstValueFrom(
      this.blogClient.send('get_all_blogs', {}),
    );
    if (getAllBlogsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getAllBlogsResponse.message,
        },
        getAllBlogsResponse.status,
      );
    }
    return {
      message: getAllBlogsResponse.message,
      data: {
        blogs: getAllBlogsResponse.blogs,
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
                blog: {
                  $ref: getSchemaPath(Blog),
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
  async createBlog(
    @Body() data: UpsertBlogDto,
    @CurrentUser() user: User,
  ): Promise<UpsertBlogDtoResponse> {
    const createBlogReponse: ServiceBlogUpsertResponse = await firstValueFrom(
      this.blogClient.send('create_blog', { ...data, userId: user.uid }),
    );
    if (createBlogReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: createBlogReponse.message,
          errors: createBlogReponse.errors,
        },
        createBlogReponse.status,
      );
    }
    return {
      message: createBlogReponse.message,
      data: {
        blog: createBlogReponse.blog,
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
                blog: {
                  $ref: getSchemaPath(Blog),
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
  async updateBlog(
    @Body() data: UpsertBlogDto,
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<UpsertBlogDtoResponse> {
    const updateBlogResponse: ServiceBlogUpsertResponse = await firstValueFrom(
      this.blogClient.send('update_blog', {
        ...data,
        id: +id,
        userId: user.uid,
      }),
    );
    if (updateBlogResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateBlogResponse.message,
          data: null,
          errors: updateBlogResponse.errors,
        },
        updateBlogResponse.status,
      );
    }
    return {
      message: updateBlogResponse.message,
      data: {
        blog: updateBlogResponse.blog,
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
    type: DeleteBlogResponseDto,
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
  async deleteBlog(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<DeleteBlogResponseDto> {
    const deleteBlogResponse: ServiceBlogDeleteResponse = await firstValueFrom(
      this.blogClient.send('delete_blog', {
        id: +id,
        userId: user.uid,
      }),
    );
    if (deleteBlogResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteBlogResponse.message,
          errors: deleteBlogResponse.errors,
        },
        deleteBlogResponse.status,
      );
    }
    return {
      message: deleteBlogResponse.message,
    };
  }
}
