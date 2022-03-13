import { UserProfile } from '../user-profile';
import { BaseResponseDto } from './base-response.dto';

export class CreateUserProfileResponseDto extends BaseResponseDto {
  data?: {
    profile: UserProfile;
  };
}
