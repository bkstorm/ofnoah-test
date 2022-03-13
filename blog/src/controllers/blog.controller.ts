import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDTO } from '../interfaces/create-blog.dto';
import { BlogService } from '../services/blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @MessagePattern('create_blog')
  async createBlog(@Body() data: CreateBlogDTO): Promise<Blog> {
    return this.blogService.createBlog(data);
  }
}
