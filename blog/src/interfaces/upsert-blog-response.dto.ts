import { Blog } from '../entities/blog.entity';

export interface UpsertBlogResponseDto {
  status: number;
  message: string;
  errors?: { [key: string]: any };
  blog?: Blog;
}
