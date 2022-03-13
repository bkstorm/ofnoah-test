import { ApiProperty } from '@nestjs/swagger';

import { Article } from './article';

export class GetAllArticlesResponseDto {
  @ApiProperty()
  message: string;

  data?: {
    articles: Article[];
  };
}
