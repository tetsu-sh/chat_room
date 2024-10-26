import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteChatRoomRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}
