import { Blog } from '../entities/blog.entity';

export interface UpdateBlogResponseDto {
  status: number;
  message: string;
  errors?: { [key: string]: any };
  blog?: Blog;
}
