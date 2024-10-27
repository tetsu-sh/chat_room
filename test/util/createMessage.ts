import { User } from '../../src/infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';
import { faker } from '@faker-js/faker';
import { Message } from 'src/infra/chatRoom/messages.entity';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';

export async function createMessage(
  repo: Repository<Message>,
  user: User,
  room: ChatRoom,
): Promise<Message> {
  const message = new Message();
  message.id = uuid();
  message.content = faker.lorem.sentence();
  message.user = user;
  message.chatRoom = room;
  await repo.save(message);
  return message;
}
