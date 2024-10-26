import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
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

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
