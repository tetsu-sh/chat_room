import { Body, Controller, Post } from '@nestjs/common';
import { ChatRoomUsecase } from 'src/usecase/chatRoomUsecase';
import { CreateChatRoomRequest } from './request/createChatRoomRequest';
import { CreateChatRoomResponse } from './response/createChatRoomResponse';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(private readonly chatRoomUsecase: ChatRoomUsecase) {}

  @Post()
  async login(
    @Body() body: CreateChatRoomRequest,
  ): Promise<CreateChatRoomResponse> {
    var id = await this.chatRoomUsecase.createRoom(body.userId);
    return new CreateChatRoomResponse((id = id));
  }
}
