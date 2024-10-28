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
import { JoinRoomRequest } from './request/joinRoomRequest';
import { PutMessageRequest } from './request/putMessageRequest';
import { EditMessageRequest } from './request/editMessageRequest';
import { ReaveRoomRequest } from './request/reaveRoomRequest';
import { RoomUpdateResponse, UpdateType } from './response/roomUpdateResponse';
import { ChatUsecase } from 'src/usecase/chatUsecase';

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
    private usecase: ChatUsecase,
  ) {}

  handleConnection(socket: Socket) {
    console.log('A user connected:', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log('User disconnected:', socket.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(socket: Socket, req: JoinRoomRequest) {
    const { roomId, userId } = req;
    try {
      const { roomData, roomUpdate } = await this.usecase.joinRoom(
        userId,
        roomId,
      );
      socket.join(roomId);
      socket.emit('roomData', roomData);
      this.server.to(roomId).emit('roomUpdate', roomUpdate);
      socket.emit('joinRoomSuccess', { message: 'Joined room successfully' });
    } catch (e) {
      console.log(e);
      socket.emit('errorMessage', e.message);
    }
  }

  @SubscribeMessage('putMessage')
  async handlePutMessage(socket: Socket, req: PutMessageRequest) {
    const { roomId, userId, content } = req;
    console.log('putMessage', content);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });
    if (!user || !chatRoom) {
      socket.emit('errorMessage', 'User or room not found');
      return;
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
  async handleEditMessage(socket: Socket, req: EditMessageRequest) {
    const { roomId, userId, content, messageId } = req;
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
  async handleLeaveRoom(socket: Socket, req: ReaveRoomRequest) {
    const { roomId, userId } = req;
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
        return;
      }
      user.joinedRoom = null;
      await this.userRepository.save(user);
      const res: RoomUpdateResponse = {
        nickName: user.nickName,
        type: UpdateType.LEFT,
      };
      this.server.to(roomId).emit('roomUpdate', res);
      console.log(`User ${userId} left room ${chatRoom.name}`);
    }
  }
}
