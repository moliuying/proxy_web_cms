
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class Taobao {

    @Prop({ required: true })
    cellphone: string;

    @Prop({ required: true })
    shenfenzheng: string;

    @Prop({ required: true, default: null})
    version: number;


    @Prop({ default: ''})
    desc: string;

    @Prop({ default: false})
    isScrapy: boolean;

    @Prop({ default: false})
    isPipei: boolean;

    @Prop({ default: false})
    isDelete: boolean;
}

export const TaobaoSchema = SchemaFactory.createForClass(Taobao);
