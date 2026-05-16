
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class Paylist {

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    parent: number;

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    uid: number;

    @Prop({ trim:true, index: true, required: true, maxlength: 11 })
    uCellphone: string;

    @Prop({ required: true })
    orderNo: string; // 自己内部的订单号 只能是数字、大小写字母_-*且在同一个商户号下唯一


    @Prop({ required: true })
    orderTime: string;   // 下订单的日期

    @Prop({ required: true })
    record_money: number;  //此次充值金额

    @Prop({ required: true })
    share_money: number;  //分佣

    @Prop({ required: true, default: 1 })
    share_type: number;  //分佣状态   0//提现失败 1//待分佣  2// 已申请  3//提现成功  4//提现拒绝



    @Prop({ required: true, default: 0 })
    share_version: number;  //提取批次

    @Prop({ default: '' })
    desc: string;

    @Prop({ default: false})
    isDelete: boolean;
}

export const PaylistSchema = SchemaFactory.createForClass(Paylist);
