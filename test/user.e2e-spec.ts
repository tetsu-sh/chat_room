import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/infra/user/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserUsecase } from '../src/usecase/userUsecase';
import { UsersModule } from '../src/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  // let repo: Repository<User>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          entities: ['dist/**/*.entity.{ts,js}'],
          migrations: ['dist/migrations/*.{ts,js}'],
          migrationsRun: true,
          synchronize: true,
        }),
      ],
      // providers: [UserUsecase],
    }).compile();

    console.log(process.env);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user/login (POST)', async () => {
    const name = faker.name.firstName();
    const res = await request(app.getHttpServer())
      .post('/user/login')
      .send({ nickName: name })
      .expect(200);
    // repo.findOne({ where: { id: res.body.id } }).then((user) => {
    //   expect(user).toBeDefined();
    //   expect(user.nickName).toBe(name);
    // });
  });
});
