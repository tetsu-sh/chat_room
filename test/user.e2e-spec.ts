import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UsersModule } from '../src/users.module';
import { LoginRequest } from '../src/presentation/user/request/loginRequest';
import { TypeOrmNamingStrategy } from '../src/config/TypeOrmNamingStrategy';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        UsersModule,
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
          entities: [User],
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
    userRepository.clear();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/user/login (POST)', async () => {
    const req = new LoginRequest();
    req.nickName = faker.person.firstName();
    const res = await request(app.getHttpServer())
      .post('/user/login')
      .send(req)
      .expect(HttpStatus.CREATED);
    userRepository.findOne({ where: { id: res.body.id } }).then((user) => {
      expect(user).toBeDefined();
      expect(user.nickName).toBe(req.nickName);
    });
  });
});
