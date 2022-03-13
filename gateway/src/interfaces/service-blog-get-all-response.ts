import { Blog } from './dto/blog';

export interface ServiceBlogGetAllResponse {
  status: number;
  message: string;
  blogs?: Blog[];
}
