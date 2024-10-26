import { faker } from '@faker-js/faker/.';
import { ChatRoom } from 'src/infra/chatRoom/chatRoom.entity';
import { User } from 'src/infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';

export async function createChatRoom(
  repo: Repository<ChatRoom>,
  owner: User,
): Promise<ChatRoom> {
  const chatRoom = new ChatRoom();
  chatRoom.id = uuid();
  chatRoom.name = faker.lorem.word() + faker.lorem.word();
  chatRoom.owner = owner;
  await repo.save(chatRoom);
  return chatRoom;
}
