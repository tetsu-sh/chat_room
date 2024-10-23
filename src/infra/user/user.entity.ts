import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { ChatRoom } from '../chatRoom/chatRoom.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nickName: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.user)
  chatRoom: ChatRoom;
}
