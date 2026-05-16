
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class Code {

    @Prop({ trim:true, index: true, required: true, maxlength: 11 })
    cellphone: string;

    @Prop({ required: true })
    code: number;


    @Prop({ default: '' })
    desc: string;

    @Prop({ default: false})
    isDelete: boolean;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
