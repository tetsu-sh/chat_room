export class RoomUpdateResponse {
  nickName: string;
  type: UpdateType;
}

export enum UpdateType {
  JOINED = 'joined',
  LEFT = 'left',
}
