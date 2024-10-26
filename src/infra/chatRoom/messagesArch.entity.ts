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
import { Message } from './messages.entity';
import { ChatRoomArch } from './chatRoomArch.entity';

@Entity()
export class MessageArch extends Message {
  @ManyToOne(() => ChatRoomArch, (chatRoom) => chatRoom.messages, {
    nullable: false,
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoomArch;
}
