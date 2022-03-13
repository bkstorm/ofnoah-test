import { BaseResponseDto } from './base-response.dto';
import { Article } from './article';

export interface UpsertArticleDtoResponse extends BaseResponseDto {
  data?: {
    article: Article;
  };
}
