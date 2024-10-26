import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../infra/user/user.entity';
import { DataSource, Repository } from 'typeorm';
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

    private readonly dataSource: DataSource,
  ) {}

  async createRoom(user_id: string, name: string): Promise<string> {
    var chatRoom = new ChatRoom();
    chatRoom.id = uuid();
    chatRoom.name = name;
    var owner = await this.userRepository.findOne({
      where: { id: user_id },
    });
    var existChatRoom = await this.chatRoomRepository.findOne({
      where: { name: name },
    });
    if (existChatRoom) {
      throw new HttpException(
        'Chat room already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!owner) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    chatRoom.owner = owner;

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
    await this.archiveChatRoom(chatRoom);
  }

  async archiveChatRoom(chatRoom: ChatRoom): Promise<void> {
    // Logical deletion with data migration to archive table

    const messages = await this.messageRepository.find({
      where: { chatRoom: { id: chatRoom.id } },
      relations: ['user'],
    });
    const chatRoomArch = this.chatRoomArchRepository.create(chatRoom);
    const messageArches = this.messageArchRepository.create(
      messages.map((message) => {
        return { ...message, chatRoom: chatRoomArch };
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(ChatRoomArch, chatRoomArch);
      await queryRunner.manager.save(MessageArch, messageArches);
      await queryRunner.manager.delete(Message, {
        chatRoom: { id: chatRoom.id },
      });
      await queryRunner.manager.delete(ChatRoom, { id: chatRoom.id });

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      throw new HttpException(
        'Failed to delete chat room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
