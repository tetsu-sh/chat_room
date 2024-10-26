import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';
import { Message } from 'src/infra/chatRoom/messages.entity';
import { MessageArch } from 'src/infra/chatRoom/messagesArch.entity';
import { ChatRoomArch } from 'src/infra/chatRoom/chatRoomArch.entity';

@Injectable()
export class ChatRoomUsecase {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatRoomArch)
    private readonly chatRoomArchRepository: Repository<ChatRoomArch>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageArch)
    private readonly messageArchRepository: Repository<MessageArch>,
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
      relations: ['owner', 'members'],
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
    if (!chatRoom.canDelete()) {
      throw new HttpException(
        'You cannot delete this room because there are members in this room',
        HttpStatus.FORBIDDEN,
      );
    }
    const messages = await this.messageRepository.find({
      where: { chatRoom: { id: roomId } },
      relations: ['user'],
    });
    const chatRoomArch = this.chatRoomArchRepository.create(chatRoom);
    const messageArches = this.messageArchRepository.create(
      messages.map((message) => {
        return { ...message, chatRoom: chatRoomArch };
      }),
    );
    await this.chatRoomArchRepository.save(chatRoomArch);
    await this.messageArchRepository.save(messageArches);

    await this.messageRepository.delete({ chatRoom: { id: chatRoom.id } });
    await this.chatRoomRepository.delete({ id: chatRoom.id });
  }
}
