import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from '../user/user.entity';
import { MessageArch } from './messagesArch.entity';

@Entity()
export class ChatRoomArch extends ChatRoom {
  @OneToMany(() => MessageArch, (message) => message.chatRoom)
  messages: MessageArch[];
}
