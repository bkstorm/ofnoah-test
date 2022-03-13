import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  errors?: { [key: string]: any };
}
