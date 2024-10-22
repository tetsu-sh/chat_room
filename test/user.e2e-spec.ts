import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserUsecase } from '../src/usecase/userUsecase';
import { UsersModule } from '../src/users.module';
import { AppModule } from '../src/app.module';
import { Login } from '../src/presentation/request/login';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    await app.init();
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
