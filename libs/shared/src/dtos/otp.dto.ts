import { Types } from 'mongoose';

export class OtpDto {
  _id: Types.ObjectId;
  email: string;
  otpCode: string;
  expiredAt: Date;
}
