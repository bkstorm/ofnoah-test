import { Article } from './dto/article';

export interface ServiceBlogGetAllArticlesResponse {
  status: number;
  message: string;
  articles?: Article[];
}
