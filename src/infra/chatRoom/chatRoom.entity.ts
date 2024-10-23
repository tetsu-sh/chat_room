import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/base.entity';
import { Message } from './messages.entity';

@Entity()
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  user: User;

  @OneToMany(() => User, (user) => user.chatRoom)
  members: User[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
