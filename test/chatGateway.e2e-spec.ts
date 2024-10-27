import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { TypeOrmNamingStrategy } from '../src/config/TypeOrmNamingStrategy';
import { ChatRoom } from '../src/infra/chatRoom/chatRoom.entity';
import { createUser } from './util/createUser';
import { Message } from '../src/infra/chatRoom/messages.entity';
import { ChatRoomModule } from '../src/chatRoom.module';
import { ChatRoomArch } from '../src/infra/chatRoom/chatRoomArch.entity';
import { MessageArch } from '../src/infra/chatRoom/messagesArch.entity';
import { createChatRoom } from './util/createChatRoom';
import { io, Socket } from 'socket.io-client';
import { createMessage } from './util/createMessage';
import { ChatGateway, MessageObject } from 'src/infra/adapter/gateway';
import { ChatGatewayModule } from 'src/chatGateway.module';

describe('ChatWebSocket (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let chatRoomRepository: Repository<ChatRoom>;
  let messageRepository: Repository<Message>;
  let socket: Socket;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test.local',
          isGlobal: true,
        }),
        ChatGatewayModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: [User, ChatRoom, Message, ChatRoomArch, MessageArch],
          synchronize: true,
          namingStrategy: new TypeOrmNamingStrategy(),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    chatRoomRepository = moduleFixture.get<Repository<ChatRoom>>(
      getRepositoryToken(ChatRoom),
    );
    messageRepository = moduleFixture.get<Repository<Message>>(
      getRepositoryToken(Message),
    );

    await app.init();
    socket = io('http://localhost:' + process.env.WEB_SOCKET_PORT, {
      timeout: 10000,
    });
  });
  afterEach(async () => {
    await messageRepository.delete({});
    await chatRoomRepository.delete({});
    await userRepository.delete({});
  });
  afterAll(async () => {
    await app.close();
  });

  it('/joinRoom (WebSocket)', async () => {
    const owner = await createUser(userRepository);
    const room = await createChatRoom(chatRoomRepository, owner);
    const user = await createUser(userRepository);
    const message = await createMessage(messageRepository, user, room);
    socket.on('errorMessage', (data) => {
      console.log(data);
    });
    // await waitForSocketConnection(socket);

    socket.on('roomData', (data) => {
      console.log(data);
      expect(data.members).toContain(user);
      const messageReceived: MessageObject = {
        id: message.id,
        nickName: user.nickName,
        content: message.content,
        userId: user.id,
        roomId: room.id,
      };
      expect(data.messages).toContain(messageReceived);
    });
    socket.emit('joinRoom', { roomId: room.id, userId: user.id }, (data) => {
      console.log(data);
      expect(data.message).toBe('You joined the room');
    });
    const joinedUser = await userRepository.findOne({
      where: { id: user.id },
      relations: ['joinedRoom'],
    });
    expect(joinedUser.joinedRoom).toBe(room);
  });
});

function waitForSocketConnection(socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      console.log('Connected to server');
      resolve(); // 接続が成功したらPromiseを解決
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      reject(error); // 接続エラーが発生したらPromiseを拒否
    });
  });
}
