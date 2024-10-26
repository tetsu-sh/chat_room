import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infra/user/user.entity';
import { ChatRoom } from './infra/chatRoom/chatRoom.entity';
import { ChatRoomController } from './presentation/chatRoom/chatRoomController';
import { ChatRoomUsecase } from './usecase/chatRoomUsecase';
import { ChatGateway } from './infra/adapter/gateway';
import { Message } from './infra/chatRoom/messages.entity';
import { ChatRoomArch } from './infra/chatRoom/chatRoomArch.entity';
import { MessageArch } from './infra/chatRoom/messagesArch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom,
      User,
      Message,
      ChatRoomArch,
      MessageArch,
    ]),
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomUsecase, ChatGateway],
})
export class ChatRoomModule {}
