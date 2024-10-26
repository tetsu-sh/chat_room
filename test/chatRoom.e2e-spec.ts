import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmNamingStrategy } from '../src/config/TypeOrmNamingStrategy';
import { ChatRoom } from '../src/infra/chatRoom/chatRoom.entity';
import { CreateChatRoomRequest } from '../src/presentation/chatRoom/request/createChatRoomRequest';
import { createUser } from './util/createUser';
import { Message } from '../src/infra/chatRoom/messages.entity';
import { ChatRoomModule } from '../src/chatRoom.module';
import { AppModule } from '../src/app.module';
import { ChatRoomArch } from '../src/infra/chatRoom/chatRoomArch.entity';
import { MessageArch } from '../src/infra/chatRoom/messagesArch.entity';
import { DeleteChatRoomRequest } from 'src/presentation/chatRoom/request/deleteChatRoomRequest';
import { createChatRoom } from './util/createChatRoom';

describe('ChatRoomController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let chatRoomRepository: Repository<ChatRoom>;
  let chatRoomArchRepository: Repository<ChatRoomArch>;
  let messageRepository: Repository<Message>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ChatRoomModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
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
    chatRoomArchRepository = moduleFixture.get<Repository<ChatRoomArch>>(
      getRepositoryToken(ChatRoomArch),
    );
    await app.init();
  });
  afterEach(async () => {
    await messageRepository.delete({});
    await chatRoomArchRepository.delete({});
    await chatRoomRepository.delete({});
    await userRepository.delete({});
  });
  afterAll(async () => {
    await app.close();
  });

  it('/chatRoom (POST)', async () => {
    var user = await createUser(userRepository);
    const req = new CreateChatRoomRequest();
    req.name = faker.lorem.word() + faker.lorem.word();
    req.userId = user.id;
    const res = await request(app.getHttpServer())
      .post('/chatRoom')
      .send(req)
      .expect(HttpStatus.CREATED);
    chatRoomRepository.findOne({ where: { id: res.body.id } }).then((room) => {
      expect(room).toBeDefined();
      expect(room.name).toBe(req.name);
    });
  });

  it('/chatRoom (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/chatRoom')
      .expect(HttpStatus.OK);
  });

  it('/chatRoom/:id/members (GET)', async () => {
    var owner = await createUser(userRepository);
    var room = await createChatRoom(chatRoomRepository, owner);
    var user = await createUser(userRepository);
    await chatRoomRepository.save(room);
    await userRepository.save(user);
    const res = await request(app.getHttpServer())
      .get('/chatRoom/' + room.id + '/members')
      .expect(HttpStatus.OK);
    res.body.forEach((member) => {
      expect(member.id).toBe(user.id);
    });
    user.joinedRoom = null;
    await userRepository.save(user);
  });

  it('/chatRoom (DELETE)', async () => {
    var owner = await createUser(userRepository);
    var room = await createChatRoom(chatRoomRepository, owner);
    var req = new DeleteChatRoomRequest();
    req.roomId = room.id;
    req.userId = owner.id;
    const res = await request(app.getHttpServer())
      .delete('/chatRoom')
      .send(req)
      .expect(HttpStatus.OK);
    chatRoomRepository.findOne({ where: { id: room.id } }).then((room) => {
      expect(room).toBeNull();
    });
  });
});
