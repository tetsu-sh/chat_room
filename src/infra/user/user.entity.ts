import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { ChatRoom } from '../chatRoom/chatRoom.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nickName: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.members)
  @JoinColumn()
  joinedRoom: ChatRoom | null;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.owner)
  ownedRooms: ChatRoom[];
}
