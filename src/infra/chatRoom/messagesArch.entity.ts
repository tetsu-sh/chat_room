import { Entity, JoinColumn, ManyToOne } from 'typeorm';
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
