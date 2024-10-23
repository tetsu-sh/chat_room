import { Module } from '@nestjs/common';
import { UserController } from './presentation/user/userController';
import { UserUsecase } from './usecase/userUsecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infra/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserUsecase],
})
export class UsersModule {}
