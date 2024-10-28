import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';
import { Message } from 'src/infra/chatRoom/messages.entity';
import { RoomDataResponse } from 'src/presentation/chat/response/roomDataResponse';
import {
  RoomUpdateResponse,
  UpdateType,
} from 'src/presentation/chat/response/roomUpdateResponse';
import { JoinRoomResponse } from 'src/presentation/chat/response/joinRoomResponse';
import uuid from 'ui7';
import { MessageResponse } from 'src/presentation/chat/response/messageResponse';

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

  async putMessage(
    userId: string,
    roomId: string,
    content: string,
  ): Promise<MessageResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });
    if (!user || !chatRoom) {
      throw new Error('User or room not found');
    }
    const newMessage = this.messageRepository.create({
      id: uuid(),
      content: content,
      chatRoom: { id: roomId },
      user: { id: userId },
    });
    await this.messageRepository.save(newMessage);
    const messageToSend: MessageResponse = {
      id: newMessage.id,
      nickName: user.nickName,
      content: content,
      userId: userId,
      roomId: roomId,
    };
    return messageToSend;
  }

  async editMessage(
    userId: string,
    roomId: string,
    messageId: string,
    content: string,
  ): Promise<MessageResponse> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['user', 'chatRoom'],
    });
    if (!message) {
      throw new Error('Message not found');
    }
    if (message.user.id !== userId) {
      throw new Error('You are not the writer of this message');
    }
    message.content = content;
    await this.messageRepository.save(message);

    // send updated message to only members in the room
    const messageToSend: MessageResponse = {
      id: messageId,
      nickName: message.user.nickName,
      content: content,
      userId: message.user.id,
      roomId: message.chatRoom.id,
    };
    return messageToSend;
  }

  async leaveRoom(userId: string, roomId: string): Promise<RoomUpdateResponse> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });
    if (!chatRoom) {
      throw new Error('Room not found');
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    user.joinedRoom = null;
    await this.userRepository.save(user);
    const res: RoomUpdateResponse = {
      nickName: user.nickName,
      type: UpdateType.LEFT,
    };
    return res;
  }
}
