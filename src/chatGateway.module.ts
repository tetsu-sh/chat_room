import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infra/user/user.entity';
import { ChatRoom } from './infra/chatRoom/chatRoom.entity';
import { Message } from './infra/chatRoom/messages.entity';
import { ChatGateway } from './infra/adapter/gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User, Message])],
  providers: [ChatGateway],
})
export class ChatGatewayModule {}
