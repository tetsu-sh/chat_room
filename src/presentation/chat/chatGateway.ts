import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomRequest } from './request/joinRoomRequest';
import { PutMessageRequest } from './request/putMessageRequest';
import { EditMessageRequest } from './request/editMessageRequest';
import { ReaveRoomRequest } from './request/reaveRoomRequest';
import { ChatUsecase } from 'src/usecase/chatUsecase';

@WebSocketGateway(Number(process.env.WEB_SOCKET_PORT) | 3001, {
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private usecase: ChatUsecase) {}

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
    try {
      const messageToSend = await this.usecase.putMessage(
        userId,
        roomId,
        content,
      );
      this.server.to(roomId).emit('receiveMessage', messageToSend);
    } catch (e) {
      console.log(e);
      socket.emit('errorMessage', e.message);
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(socket: Socket, req: EditMessageRequest) {
    const { roomId, userId, content, messageId } = req;
    try {
      const messageToSend = await this.usecase.editMessage(
        userId,
        roomId,
        messageId,
        content,
      );
      this.server.to(roomId).emit('messageUpdated', messageToSend);
    } catch (e) {
      socket.emit('errorMessage', e.message);
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(socket: Socket, req: ReaveRoomRequest) {
    const { roomId, userId } = req;
    try {
      const res = await this.usecase.leaveRoom(userId, roomId);
      socket.leave(roomId.toString());
      this.server.to(roomId).emit('roomUpdate', res);
    } catch (e) {
      socket.emit('errorMessage', e.message);
    }
  }
}
