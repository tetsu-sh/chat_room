import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';

@Injectable()
export class ChatRoomUsecase {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRoom(user_id: string): Promise<string> {
    var chatRoom = new ChatRoom();
    chatRoom.id = uuid();
    chatRoom.name = 'room' + chatRoom.id;
    try {
      chatRoom.owner = await this.userRepository.findOne({
        where: { id: user_id },
      });
    } catch (e) {
      console.log(e);
    }
    await this.chatRoomRepository.save(chatRoom);
    return chatRoom.id;
  }

  async listRooms(): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find();
  }

  async getRoomMembers(roomId: string): Promise<User[]> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['members'],
    });
    return chatRoom.members;
  }

  async deleteChatRoom(userId: string, roomId: string): Promise<void> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['owner'],
    });
    const reqUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (chatRoom.owner.id !== reqUser.id) {
      throw new HttpException(
        'You are not the owner of this room',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.chatRoomRepository.delete({ id: roomId });
  }
}
