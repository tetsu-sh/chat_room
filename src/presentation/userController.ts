import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { UserUsecase } from '../usecase/userUsecase';
import { Login } from './request/login';

@Controller('user')
export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

  @Post('login')
  async login(@Body() body: Login): Promise<string> {
    return await this.userUsecase.login(body.nickName);
  }
}
