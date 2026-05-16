import { Module } from '@nestjs/common';

import { UserController } from "./controller";
import { UserService } from "./service";

import { MongooseModule } from '@nestjs/mongoose'
import { User,UserSchema } from '../../core/schemas/user.schema'
import { Order,OrderSchema } from '../../core/schemas/order.schema'
import {Code,CodeSchema} from "../../core/schemas/code.schema";
import {Vip,VipSchema} from "../../core/schemas/vip.schema";

@Module({
    // imports:[
    //     TypeOrmModule.forFeature([UserEntity])
    // ],
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
        ])
    ]
})
export class UserModule {}
