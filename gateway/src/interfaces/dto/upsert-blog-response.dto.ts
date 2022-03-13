import { Blog } from './blog';

export interface UpsertBlogDtoResponse {
  message: string;
  errors?: { [key: string]: any };
  data?: {
    blog: Blog;
  };
}
