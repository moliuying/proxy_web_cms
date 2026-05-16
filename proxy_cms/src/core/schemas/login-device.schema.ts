
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class LoginDevice {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, index: true, unique: true })
  deviceToken: string;

  @Prop({ default: '' })
  ip: string;

  @Prop({ default: '' })
  userAgent: string;

  @Prop({ default: '' })
  deviceFingerprint: string;

  @Prop({ default: '' })
  deviceName: string;

  @Prop({ default: '' })
  deviceType: string;

  @Prop({ default: '' })
  browser: string;

  @Prop({ default: '' })
  os: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ default: false })
  isCurrent: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null })
  lastActiveAt: Date;
}

export type LoginDeviceDocument = LoginDevice & Document;
export const LoginDeviceSchema = SchemaFactory.createForClass(LoginDevice);
