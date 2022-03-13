import { UserProfile } from '../entities/user-profile.entity';

export interface CreateUserProfileResponseDto {
  status: number;
  message: string;
  errors?: { [key: string]: any };
  profile?: UserProfile;
}
