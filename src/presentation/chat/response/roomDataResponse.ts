import { MessageResponse } from './messageResponse';
import { User } from './user';

export class RoomDataResponse {
  members: User[];
  messages: MessageResponse[];
}
