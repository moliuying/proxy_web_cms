
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class GroupList {

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    uid: number;

    @Prop({ default: '' })
    group_name: string;

    @Prop({ default: 1 })
    group_index: number;


    @Prop({ default: '' })
    desc: string;

    @Prop({ default: false})
    isDelete: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(GroupList);
