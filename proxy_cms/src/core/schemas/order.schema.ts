
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })



//     out_trade_no: DataTypes.STRING,  // 自己内部的订单号 只能是数字、大小写字母_-*且在同一个商户号下唯一
//     notify_url:DataTypes.STRING,  //通知地址 通知URL必须为直接可访问的URL，不允许携带查询串
//     amount_total: DataTypes.INTEGER,  //充值金额 统一人民币支付 单位CNY
//     desc: DataTypes.STRING,  //备注
//     if_get_vx_response:{  //支付收到了微信回调结果信息
//     type: DataTypes.INTEGER,
//         defaultValue: 0,//默认值是0
// },
// vx_response_info: DataTypes.STRING,  // 微信支付返回的消息

export class Order {

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    uid: number; //下单人用户ID

    @Prop({ required: true })
    orderNo: string; // 自己内部的订单号 只能是数字、大小写字母_-*且在同一个商户号下唯一

    @Prop({ required: true })
    money: number;  //充值金额 统一人民币支付 单位CNY

    @Prop({ required: true,default: 0}) //会员充值时间
    custom_days: number;

    @Prop({ required: true })
    type: string;  //微信还是支付宝充值

    @Prop({ default: ''})
    desc: string;  //微信还是支付宝充值

    @Prop({ default: false})
    ifGetVxResponse: boolean;

    @Prop({ default: ''})
    vxResponseInfo: string;  //微信支付返回的消息



    @Prop({ default: false})
    isDelete: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
