import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ApiHeader,
  ApiOkResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';
import { CreateUserProfileResponseDto } from '../interfaces/dto/create-user-profile-response.dto';
import { CreateUserProfileDto } from '../interfaces/dto/create-user-profile.dto';
import { ServiceUserCreateProfileResponse } from '../interfaces/service-user-create-profile-response';
import { UserProfile } from '../interfaces/user-profile';
import { BaseResponseDto } from '../interfaces/dto/base-response.dto';

@Controller('users')
@ApiExtraModels(UserProfile, BaseResponseDto)
export class UserController {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) {}

  @Post(':id/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Firebase Authentication uid' })
  @ApiOkResponse({
    description: 'The profile has been successfully created.',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(BaseResponseDto),
        },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                profile: {
                  $ref: getSchemaPath(UserProfile),
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'Firebase Authentication idToken is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected error happended',
  })
  async createUserProfile(
    @Param('id') uid: string,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ): Promise<CreateUserProfileResponseDto> {
    const createProfileResponse: ServiceUserCreateProfileResponse =
      await firstValueFrom(
        this.userClient.send('create_user_profile', {
          ...createUserProfileDto,
          uid,
        }),
      );
    if (createProfileResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: createProfileResponse.message,
          errors: createProfileResponse.errors,
        },
        createProfileResponse.status,
      );
    }
    return {
      message: 'Success',
      data: {
        profile: createProfileResponse.profile,
      },
    };
  }
}
