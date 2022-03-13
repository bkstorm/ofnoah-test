import { ApiProperty } from '@nestjs/swagger';

export class Blog {
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
