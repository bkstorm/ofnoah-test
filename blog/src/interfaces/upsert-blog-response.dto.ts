import { Blog } from '../entities/blog.entity';
import { BaseResponseDto } from './base-reponse.dto';

export interface UpsertBlogResponseDto extends BaseResponseDto {
  blog?: Blog;
}
