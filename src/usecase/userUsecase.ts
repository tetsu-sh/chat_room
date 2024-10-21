import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';

@Injectable()
export class UserUsecase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(nickName: string): Promise<string> {
    const user = new User();
    user.id = uuid();
    user.nickName = nickName;
    await this.userRepository.save(user);
    return user.id;
  }
}
