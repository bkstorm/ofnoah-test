import { Blog } from '../entities/blog.entity';
import { BaseResponseDto } from './base-reponse.dto';

export interface GetAllBlogsReponseDto extends BaseResponseDto {
  blogs?: Blog[];
}
