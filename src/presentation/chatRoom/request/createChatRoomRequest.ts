import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRoomRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
