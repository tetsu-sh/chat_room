import { User } from 'src/infra/user/user.entity';
import { Repository } from 'typeorm';
import uuid from 'ui7';
import { faker } from '@faker-js/faker';

export async function createUser(repo: Repository<User>): Promise<User> {
  const user = new User();
  user.id = uuid();
  user.nickName = faker.person.firstName();
  await repo.save(user);
  return user;
}
