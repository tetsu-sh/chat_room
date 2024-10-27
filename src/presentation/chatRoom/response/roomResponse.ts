import { ApiProperty } from '@nestjs/swagger';

export class chatRoomResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
