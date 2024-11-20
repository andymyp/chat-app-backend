import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class User extends AbstractDocument {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  about: string;

  @Prop({ type: String, index: true, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Boolean, default: false })
  online: boolean;

  @Prop({ type: Number, default: 0 })
  status: number;

  @Prop({ type: String })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
