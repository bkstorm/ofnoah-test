import { ApiProperty } from '@nestjs/swagger';

export class Article {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}
