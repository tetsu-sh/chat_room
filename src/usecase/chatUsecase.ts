import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';
import { Message } from 'src/infra/chatRoom/messages.entity';
import { RoomDataResponse } from 'src/presentation/chat/response/roomDataResponse';
import { UpdateType } from 'src/presentation/chat/response/roomUpdateResponse';
import { JoinRoomResponse } from 'src/presentation/chat/response/joinRoomResponse';

@Injectable()
export class ChatUsecase {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async joinRoom(userId: string, roomId: string): Promise<JoinRoomResponse> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['members'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['joinedRoom'],
    });
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }
    if (!user) {
      throw new Error('User not found');
    }
    if (user.joinedRoom) {
      throw new Error('You are already in a room');
    }

    user.joinedRoom = chatRoom;
    await this.userRepository.save(user);

    const messages = await this.messageRepository.find({
      where: { chatRoom: { id: roomId } },
      order: { createdAt: 'ASC' },
      relations: ['user', 'chatRoom'],
    });
    const roomData: RoomDataResponse = {
      members: chatRoom.members.map((member) => {
        return {
          id: member.id,
          nickName: member.nickName,
        };
      }),
      messages: messages.map((message) => {
        return {
          id: message.id,
          nickName: message.user.nickName,
          content: message.content,
          userId: message.user.id,
          roomId: message.chatRoom.id,
        };
      }),
    };
    const roomUpdate = {
      nickName: user.nickName,
      type: UpdateType.JOINED,
    };
    return { roomData, roomUpdate };
  }
}
