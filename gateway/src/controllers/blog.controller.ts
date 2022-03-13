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

@Controller('blogs')
export class BlogController {
  constructor(@Inject('BLOG_SERVICE') private blogClient: ClientProxy) {}

  @Get()
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
