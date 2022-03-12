import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UserProfile } from '../entities/user-profile.entity';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern('create_user_profile')
  createProfile(profile: UserProfile): Promise<UserProfile> {
    return this.userService.createProfile(profile);
  }
}
