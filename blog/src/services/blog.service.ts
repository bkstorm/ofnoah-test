import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Blog } from '../entities/blog.entity';
import { CreateBlogDTO } from '../interfaces/create-blog.dto';
import { UpdateBlogDTO } from '../interfaces/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find({ order: { id: 'DESC' } });
  }

  async findBlogById(id: number): Promise<Blog> {
    return this.blogRepository.findOne(id);
  }

  async createBlog(data: CreateBlogDTO): Promise<Blog> {
    return this.blogRepository.save(data);
  }

  async updateBlog(data: UpdateBlogDTO): Promise<Blog> {
    return this.blogRepository.save(data);
  }

  async deleteBlog(id: number): Promise<DeleteResult> {
    return this.blogRepository.delete(id);
  }
}
