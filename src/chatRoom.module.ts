import { Module } from '@nestjs/common';
import { UserController } from './presentation/user/userController';
import { UserUsecase } from './usecase/userUsecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infra/user/user.entity';
import { ChatRoom } from './infra/chatRoom/chatRoom.entity';
import { ChatRoomController } from './presentation/chatRoom/chatRoomController';
import { ChatRoomUsecase } from './usecase/chatRoomUsecase';
import { ChatGateway } from './infra/adoptor/gateway';
import { Message } from './infra/chatRoom/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User, Message])],
  controllers: [ChatRoomController],
  providers: [ChatRoomUsecase, ChatGateway],
})
export class ChatRoomModule {}
