import { Article } from './dto/article';

export interface ServiceBlogUpsertArticleResponse {
  status: number;
  message: string;
  errors?: { [key: string]: any };
  article?: Article;
}
