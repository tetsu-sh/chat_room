import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatRoomUsecase } from 'src/usecase/chatRoomUsecase';
import { CreateChatRoomRequest } from './request/createChatRoomRequest';
import { CreateChatRoomResponse } from './response/createChatRoomResponse';
import { chatRoomResponse } from './response/roomResponse';
import { DeleteChatRoomRequest } from './request/deleteChatRoomRequest';
import { User } from 'src/infra/user/user.entity';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(private readonly chatRoomUsecase: ChatRoomUsecase) {}

  @Post()
  async createRoom(
    @Body() body: CreateChatRoomRequest,
  ): Promise<CreateChatRoomResponse> {
    let id = await this.chatRoomUsecase.createRoom(body.userId, body.name);
    return new CreateChatRoomResponse((id = id));
  }

  @Get()
  async listRooms(): Promise<chatRoomResponse[]> {
    return await this.chatRoomUsecase.listRooms();
  }

  @Get(':id/members') // ルームIDに基づいてメンバーを取得
  async getRoomMembers(@Param('id') roomId: string): Promise<User[]> {
    return await this.chatRoomUsecase.getRoomMembers(roomId);
  }

  @Delete() // チャットルームを削除
  async deleteChatRoom(@Body() body: DeleteChatRoomRequest) {
    await this.chatRoomUsecase.deleteChatRoom(body.userId, body.roomId);
  }
}
