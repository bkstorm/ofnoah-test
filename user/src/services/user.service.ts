import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserProfile } from '../entities/user-profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
  ) {}

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    return this.profileRepository.save(profile);
  }
}
