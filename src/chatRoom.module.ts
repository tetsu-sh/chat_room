import { Module } from '@nestjs/common';
import { UserController } from './presentation/user/userController';
import { UserUsecase } from './usecase/userUsecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infra/user/user.entity';
import { ChatRoom } from './infra/chatRoom/chatRoom.entity';
import { ChatRoomController } from './presentation/chatRoom/chatRoomController';
import { ChatRoomUsecase } from './usecase/chatRoomUsecase';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User])],
  controllers: [ChatRoomController],
  providers: [ChatRoomUsecase],
})
export class ChatRoomModule {}
