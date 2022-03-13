import { Blog } from './dto/blog';

export interface ServiceBlogUpsertResponse {
  status: number;
  message: string;
  errors?: { [key: string]: any };
  blog?: Blog;
}
