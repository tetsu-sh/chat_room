import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infra/user/user.entity';
import { ChatRoom } from './infra/chatRoom/chatRoom.entity';
import { Message } from './infra/chatRoom/messages.entity';
import { ChatGateway } from './presentation/chat/chatGateway';
import { ChatUsecase } from './usecase/chatUsecase';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User, Message])],
  providers: [ChatGateway, ChatUsecase],
})
export class ChatGatewayModule {}
