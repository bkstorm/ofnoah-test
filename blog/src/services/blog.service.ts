import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDTO } from '../interfaces/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async createBlog(data: CreateBlogDTO): Promise<Blog> {
    return this.blogRepository.save(data);
  }
}
