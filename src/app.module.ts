import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users.module';
import { TypeOrmNamingStrategy } from './config/TypeOrmNamingStrategy';
import { ChatRoomModule } from './chatRoom.module';
import { ChatGatewayModule } from './chatGateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      namingStrategy: new TypeOrmNamingStrategy(),
    }),
    UsersModule,
    ChatRoomModule,
    ChatGatewayModule,
  ],
})
export class AppModule {}
