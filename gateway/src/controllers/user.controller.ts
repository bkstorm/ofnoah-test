import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AuthGuard } from '../guards/auth.guard';
import { CreateUserProfileResponseDTO } from '../interfaces/create-user-profile-response.dto';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post(':id/profile')
  createUserProfile(
    @Param('id') uid: string,
    @Body() createUserProfileDTO: CreateUserProfileResponseDTO,
  ): Promise<CreateUserProfileResponseDTO> {
    return firstValueFrom(
      this.userClient.send('create_user_profile', {
        ...createUserProfileDTO,
        uid,
      }),
    );
  }
}
