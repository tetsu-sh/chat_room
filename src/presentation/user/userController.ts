import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { UserUsecase } from '../../usecase/userUsecase';
import { LoginRequest } from './request/loginRequest';
import { LoginResponse } from './response/loginResponse';

@Controller('user')
export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    var id = await this.userUsecase.login(body.nickName);
    return new LoginResponse((id = id));
  }
}
