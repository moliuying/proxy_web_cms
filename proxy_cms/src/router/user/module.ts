import { Module } from '@nestjs/common';

import { UserController } from "./controller";
import { UserService } from "./service";

import { MongooseModule } from '@nestjs/mongoose'
import { User,UserSchema } from '../../core/schemas/user.schema'
import { Order,OrderSchema } from '../../core/schemas/order.schema'
import {Code,CodeSchema} from "../../core/schemas/code.schema";
import {Vip,VipSchema} from "../../core/schemas/vip.schema";
import {Bill,BillSchema} from "../../core/schemas/bill.schema";
import { LoginDevice, LoginDeviceSchema } from '../../core/schemas/login-device.schema';

@Module({
    controllers: [
        UserController
    ],
    providers: [
        UserService
    ],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Order.name, schema: OrderSchema },
            { name: Code.name, schema: CodeSchema },
            { name: Vip.name, schema: VipSchema },
            { name: Bill.name, schema: BillSchema },
            { name: LoginDevice.name, schema: LoginDeviceSchema },
        ])
    ]
})
export class UserModule {}
