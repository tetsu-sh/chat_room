import { Body, Controller, Post } from '@nestjs/common';
import { UserUsecase } from 'src/usecase/userUsecase';
import { LoginRequest } from './request/loginRequest';
import { LoginResponse } from './response/loginResponse';

@Controller('user')
export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    let id = await this.userUsecase.login(body.nickName);
    return new LoginResponse((id = id));
  }
}
