import { Entity, OneToMany } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { MessageArch } from './messagesArch.entity';

@Entity()
export class ChatRoomArch extends ChatRoom {
  @OneToMany(() => MessageArch, (message) => message.chatRoom)
  messages: MessageArch[];
}
