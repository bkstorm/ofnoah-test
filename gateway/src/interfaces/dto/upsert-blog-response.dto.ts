import { BaseResponseDto } from './base-response.dto';
import { Blog } from './blog';

export interface UpsertBlogDtoResponse extends BaseResponseDto {
  data?: {
    blog: Blog;
  };
}
