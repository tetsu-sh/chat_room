import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatRoom } from '../chatRoom/chatRoom.entity';
import { User } from '../user/user.entity';
import { Message } from '../chatRoom/messages.entity';
import uuid from 'ui7';
import { el } from '@faker-js/faker/.';
import { emit } from 'process';

// cors

type MessageObject = {
  nickName: string;
  content: string;
};

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  handleConnection(socket: Socket) {
    console.log('A user connected:', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('User disconnected:', socket.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    socket: Socket,
    { roomId, userId }: { roomId: string; userId: string },
  ) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['members', 'messages'],
    });

    if (chatRoom) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['joinedRoom'],
      });
      if (user) {
        console.log(user);
        if (user.joinedRoom !== null) {
          socket.emit('errorMessage', 'You are already in a room');
        }
        user.joinedRoom = chatRoom;
        await this.userRepository.save(user);
        socket.join(roomId);
        console.log(`User ${userId} is joining room ${roomId}`);
        socket.emit('roomData', {
          members: chatRoom.members,
          messages: chatRoom.messages,
        });
        this.server.to(roomId).emit('roomUpdate', user.nickName);
      }
    } else {
      socket.emit('errorMessage', 'Room not found');
    }
  }

  @SubscribeMessage('putMessage')
  async handlePutMessage(
    socket: Socket,
    {
      roomId,
      userId,
      content,
    }: { roomId: string; userId: string; content: string },
  ) {
    console.log('putMessage', content);
    var user = await this.userRepository.findOne({ where: { id: userId } });
    var chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });
    if (!user || !chatRoom) {
      socket.emit('errorMessage', 'User or room not found');
    }
    const newMessage = this.messageRepository.create({
      content: content,
      chatRoom: { id: roomId },
    });
    await this.messageRepository.save(newMessage);

    this.server.to(roomId).emit('receiveMessage', content); // ルーム内の全ユーザーにメッセージを送信
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    socket: Socket,
    { roomId, userId }: { roomId: string; userId: string },
  ) {
    socket.leave(roomId.toString());
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });

    if (chatRoom) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        socket.emit('errorMessage', 'User not found');
      }
      user.joinedRoom = null;
      await this.userRepository.save(user);
      this.server.to(roomId).emit('roomUpdate', user.nickName);
      console.log(`User ${userId} left room ${chatRoom.name}`);
    }
  }
}
