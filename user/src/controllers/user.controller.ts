import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateUserProfileResponseDto } from '../interfaces/create-user-profile-response.dto';
import { CreateUserProfileDto } from '../interfaces/create-user-profile.dto';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern('create_user_profile')
  async createProfile(
    profile: CreateUserProfileDto,
  ): Promise<CreateUserProfileResponseDto> {
    try {
      const createdProfile = await this.userService.createProfile(profile);
      return {
        status: HttpStatus.OK,
        message: 'Success',
        profile: createdProfile,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }
  }
}
