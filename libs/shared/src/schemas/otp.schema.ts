import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class Otp extends AbstractDocument {
  @Prop({ type: String, index: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  otpCode: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
