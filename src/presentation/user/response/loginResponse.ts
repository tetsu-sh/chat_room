import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
