import { Body, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDTO } from '../interfaces/create-blog.dto';
import { DeleteBlogResponseDto } from '../interfaces/delete-blog-response.dto';
import { DeleteBlogDto } from '../interfaces/delete-blog.dto';
import { UpdateBlogResponseDto } from '../interfaces/update-blog-response.dto';
import { UpdateBlogDTO } from '../interfaces/update-blog.dto';
import { BlogService } from '../services/blog.service';

@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @MessagePattern('create_blog')
  async createBlog(@Body() data: CreateBlogDTO): Promise<Blog> {
    return this.blogService.createBlog(data);
  }

  @MessagePattern('update_blog')
  async updateBlog(
    @Body() data: UpdateBlogDTO,
  ): Promise<UpdateBlogResponseDto> {
    const ability = this.caslAbilityFactory.createForUser({ uid: data.userId });
    try {
      const blog = await this.blogService.findBlogById(data.id);
      if (!blog) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Blog not found',
        };
      }
      if (!ability.can(Action.Update, blog)) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Access denied!',
        };
      }
      const updatedBlog = await this.blogService.updateBlog(data);
      return {
        status: HttpStatus.OK,
        message: 'Success',
        blog: updatedBlog,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }

  @MessagePattern('delete_blog')
  async deleteBlog(
    @Body() data: DeleteBlogDto,
  ): Promise<DeleteBlogResponseDto> {
    const ability = this.caslAbilityFactory.createForUser({ uid: data.userId });
    try {
      const blog = await this.blogService.findBlogById(data.id);
      if (!blog) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Blog not found',
        };
      }
      if (!ability.can(Action.Delete, blog)) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Access denied!',
        };
      }
      await this.blogService.deleteBlog(data.id);
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
