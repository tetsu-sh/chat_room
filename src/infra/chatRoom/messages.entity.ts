import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/base.entity';
import { ChatRoom } from './chatRoom.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  content: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
