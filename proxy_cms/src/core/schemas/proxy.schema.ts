
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';

@Schema({ versionKey: false,timestamps: true })
export class Proxy {

    @Prop({required: true, type: Types.ObjectId, ref: 'user' })
    uid: number;

    @Prop({ default: '' })
    group_name: string;

    @Prop({ default: '' })
    proxy_name: string;

    @Prop({ default: '' })
    proxy_cookies: string;

    @Prop({ default: 0 })
    proxy_city: number;




    @Prop({ default: '' })
    longitude: string;

    @Prop({ default: '' })
    latitude: string;


    @Prop({ default: 1 })
    chrome_port: number;




    @Prop({ default: '' })
    proxy_ip: string;

    @Prop({ default: '' })
    proxy_port: string;

    @Prop({ default: 'socks5' })
    proxy_type: string;


    @Prop({ default: '' })
    desc: string;

    @Prop({ default: '' })
    ua: string;
    @Prop({ default: '' })
    pingtai: string;

    @Prop({ default: false})
    isDelete: boolean;
}

export const ProxySchema = SchemaFactory.createForClass(Proxy);
