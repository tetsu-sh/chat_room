import { Injectable } from '@nestjs/common';
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
    chatRoom.name = 'room';
    var user = await this.userRepository.findOne({ where: { id: user_id } });
    chatRoom.user = user;

    await this.chatRoomRepository.save(chatRoom);
    return chatRoom.id;
  }

  async joinRoom(user_id: string, room_id: string): Promise<void> {
    var chatRoom = await this.chatRoomRepository.findOne({
      where: { id: room_id },
    });
    var user = await this.userRepository.findOne({ where: { id: user_id } });
    // user.chatRoom = chatRoom;
    chatRoom.members.push(user);
    await this.chatRoomRepository.save(chatRoom);

    // await this.userRepository.save(user);
  }
}
