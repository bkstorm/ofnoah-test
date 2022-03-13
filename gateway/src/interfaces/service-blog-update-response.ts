import { Blog } from './dto/blog';

export interface ServiceBlogUpdateResponse {
  status: number;
  message: string;
  errors?: { [key: string]: any };
  blog?: Blog;
}
