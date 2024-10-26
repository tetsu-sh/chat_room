import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatRoomUsecase } from 'src/usecase/chatRoomUsecase';
import { CreateChatRoomRequest } from './request/createChatRoomRequest';
import { CreateChatRoomResponse } from './response/createChatRoomResponse';
import { chatRoomResponse } from './response/roomResponse';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(private readonly chatRoomUsecase: ChatRoomUsecase) {}

  @Post()
  async createRoom(
    @Body() body: CreateChatRoomRequest,
  ): Promise<CreateChatRoomResponse> {
    var id = await this.chatRoomUsecase.createRoom(body.userId);
    return new CreateChatRoomResponse((id = id));
  }

  @Get()
  async listRooms(): Promise<chatRoomResponse[]> {
    return await this.chatRoomUsecase.listRooms();
  }

  @Get(':id/members') // ルームIDに基づいてメンバーを取得
  async getRoomMembers(@Param('id') roomId: string) {
    return await this.chatRoomUsecase.getRoomMembers(roomId);
  }
}
