import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomResponse {
  @ApiProperty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
