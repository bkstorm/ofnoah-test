import { ApiProperty } from '@nestjs/swagger';

import { Blog } from './blog';

export class GetAllBlogsResponseDto {
  @ApiProperty()
  message: string;

  data?: {
    blogs: Blog[];
  };
}
