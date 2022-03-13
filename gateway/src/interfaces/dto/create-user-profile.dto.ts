import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProfileDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: String, format: 'date' })
  birthdate: Date;
}
