import { Types } from 'mongoose';

export class UserDto {
  _id: Types.ObjectId;
  name: string;
  about: string;
  email: string;
  password?: string;
  avatar: string;
  online: boolean;
  status: number;
  refreshToken: string;
}

export class UserResponseDto {
  _id: string;
  name: string;
  about: string;
  email: string;
  avatar: string;
  online: boolean;
  status: number;
}
