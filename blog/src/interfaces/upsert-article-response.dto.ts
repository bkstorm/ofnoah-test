import { Article } from '../entities/article.entity';
import { BaseResponseDto } from './base-reponse.dto';

export interface UpsertArticleResponseDto extends BaseResponseDto {
  article?: Article;
}
