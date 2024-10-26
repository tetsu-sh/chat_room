import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.ownedRooms)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => User, (user) => user.joinedRoom)
  members: User[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];

  canDelete(): boolean {
    return this.members.length === 0;
  }
}
