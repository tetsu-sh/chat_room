import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';
import { User } from 'src/infra/user/user.entity';
import { Message } from 'src/infra/chatRoom/messages.entity';
import uuid from 'ui7';
import { MessageResponse } from './response/messageResponse';

@WebSocketGateway(Number(process.env.WEB_SOCKET_PORT) | 3001, {
  cors: { origin: '*' },
})
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
      relations: ['members'],
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
        const messages = await this.messageRepository.find({
          where: { chatRoom: { id: roomId } },
          order: { createdAt: 'ASC' },
          relations: ['user', 'chatRoom'],
        });

        socket.emit('roomData', {
          members: chatRoom.members,
          messages: messages.map(
            (message): MessageResponse => ({
              id: message.id,
              nickName: message.user.nickName,
              content: message.content,
              userId: message.user.id,
              roomId: message.chatRoom.id,
            }),
          ),
        });
        this.server.to(roomId).emit('roomUpdate', user.nickName);
        socket.emit('joinRoomSuccess', { message: 'Joined room successfully' });
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
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });
    if (!user || !chatRoom) {
      socket.emit('errorMessage', 'User or room not found');
    }
    const newMessage = this.messageRepository.create({
      id: uuid(),
      content: content,
      chatRoom: { id: roomId },
      user: { id: userId },
    });
    await this.messageRepository.save(newMessage);

    // send message to only members in the room
    const messageToSend: MessageResponse = {
      id: newMessage.id,
      nickName: user.nickName,
      content: content,
      userId: userId,
      roomId: roomId,
    };
    this.server.to(roomId).emit('receiveMessage', messageToSend);
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    socket: Socket,
    {
      roomId,
      userId,
      content,
      messageId,
    }: { roomId: string; userId: string; content: string; messageId: string },
  ) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['user', 'chatRoom'],
    });
    if (message) {
      if (message.user.id !== userId) {
        socket.emit('errorMessage', 'You are not the writer of this message');
        return;
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
      this.server.to(roomId).emit('messageUpdated', messageToSend);
    } else {
      socket.emit('errorMessage', 'Message not found');
    }
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
