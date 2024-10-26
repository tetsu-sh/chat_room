import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';

@Injectable()
export class UserUsecase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(nickName: string): Promise<string> {
    var existUser = await this.userRepository.findOne({
      where: { nickName: nickName },
    });
    if (existUser) {
      return existUser.id;
    }
    const user = new User();
    user.id = uuid();
    user.nickName = nickName;
    await this.userRepository.save(user);
    return user.id;
  }
}
