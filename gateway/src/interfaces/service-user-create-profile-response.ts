import { BaseServiceResponse } from './base-service-response';
import { UserProfile } from './user-profile';

export interface ServiceUserCreateProfileResponse extends BaseServiceResponse {
  profile: UserProfile;
}
