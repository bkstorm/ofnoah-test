import {
  Body,
  Controller,
  Delete,
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
import { Blog } from '../interfaces/dto/blog';
import { DeleteBlogResponseDto } from '../interfaces/dto/delete-blog-response.dto';
import { UpsertBlogDto } from '../interfaces/dto/upsert-blog.dto';
import { ServiceBlogDeleteResponse } from '../interfaces/service-blog-delete-response';
import { ServiceBlogUpdateResponse } from '../interfaces/service-blog-update-response';
import { User } from '../interfaces/user';

@Controller('blogs')
export class BlogController {
  constructor(@Inject('BLOG_SERVICE') private blogClient: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post()
  async createBlog(
    @Body() data: UpsertBlogDto,
    @CurrentUser() user: User,
  ): Promise<Blog> {
    return firstValueFrom(
      this.blogClient.send('create_blog', { ...data, userId: user.uid }),
    );
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateBlog(
    @Body() data: UpsertBlogDto,
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<Blog> {
    const updateBlogResponse: ServiceBlogUpdateResponse = await firstValueFrom(
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
    return updateBlogResponse.blog;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
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
