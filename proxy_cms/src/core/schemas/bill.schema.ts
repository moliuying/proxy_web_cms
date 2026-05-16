
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class Bill {

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    uid: number;

    @Prop({ required: true })
    prev_money: number;

    @Prop({ required: true })
    add_money: number;

    @Prop({ required: true })
    now_money: number;

    @Prop({ required: true,default: 0}) //会员充值时间
    custom_days: number;

    @Prop({ required: true })
    orderNo: string; // 自己内部的订单号 只能是数字、大小写字母_-*且在同一个商户号下唯一

    @Prop({ required: true })
    recordWay: number; // 充值方式  1微信 2支付宝

    @Prop({ default: '' })
    desc: string;

    @Prop({ default: false})
    isDelete: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
