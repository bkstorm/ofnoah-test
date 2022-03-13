import { Article } from '../entities/article.entity';
import { BaseResponseDto } from './base-reponse.dto';

export interface GetAllArticlesReponseDto extends BaseResponseDto {
  articles?: Article[];
}
