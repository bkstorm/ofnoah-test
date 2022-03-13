import { ApiProperty } from '@nestjs/swagger';

export class UserProfile {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', format: 'date' })
  birthdate: Date;
}
