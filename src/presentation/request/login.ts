import { IsNotEmpty, IsString } from 'class-validator';

export class Login {
  @IsString()
  @IsNotEmpty()
  nickName: string;
}
