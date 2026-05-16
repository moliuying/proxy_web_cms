
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
// export type UserDocument = User & Document;

@Schema({ versionKey: false,timestamps: true })
export class User {

    // @Prop({ required: true,index: true})
    // id: string;

    @Prop({ trim:true, index: true, required: true, maxlength: 11 })
    cellphone: string;

    @Prop({ trim:true, index: true, required: true })
    userName: string;

    @Prop({ trim:true, required: true, maxlength: 32 })
    password: string;

    @Prop({ trim:true, default: '' })
    token: string;

    @Prop({ trim:true })
    address: string;

    @Prop({ default:0 })
    age: number;

    @Prop({ default:0 })
    yue: number;  //账户余额

    @Prop({ default: false})
    isDelete: boolean;

    @Prop({ default: null}) //会员到期时间
    expireDate: Date;


    @Prop({ default: 0}) // 0 普通用户 1 管理员
    roleType: number;

    @Prop({ default: null}) //
    companyName: string;

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    parent: number;
    // @Prop({ default: Date.now })
    // createdAt: Date;
    //
    // @Prop({ default: Date.now })
    // updateAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
