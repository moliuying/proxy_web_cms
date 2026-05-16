
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class Vip {

    @Prop({required: false, type: Types.ObjectId, ref: 'User' })
    use_uid: number;

    @Prop({required: false, type: Types.ObjectId, ref: 'User' })
    create_uid: number;

    @Prop({ default: '' })
    type: string;  //'1' 月  '2' 季度  3 '年'

    @Prop({ default: 0 })
    is_use: number;  //0 未使用  1 已使用

    @Prop({ required: false,default: null })
    use_time: Date;  // 使用时间

    @Prop({ default: false})
    isDelete: boolean;
}

export const VipSchema = SchemaFactory.createForClass(Vip);
