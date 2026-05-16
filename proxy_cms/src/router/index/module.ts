import { Module } from '@nestjs/common'

import { IndexController } from "./controller"
import { IndexService } from "./service"

import { MongooseModule } from '@nestjs/mongoose'
import { Bill,BillSchema } from '../../core/schemas/bill.schema'
import { Code,CodeSchema } from '../../core/schemas/code.schema'
import { Order,OrderSchema } from '../../core/schemas/order.schema'
import { User, UserSchema } from '../../core/schemas/user.schema'
import { Proxy, ProxySchema } from '../../core/schemas/proxy.schema'
import { Taobao, TaobaoSchema } from '../../core/schemas/taobao.schema'
import { Paylist, PaylistSchema } from '../../core/schemas/pay_list.schema'
import { GroupList, GroupSchema } from '../../core/schemas/group_list.schema'
import { Vip, VipSchema } from '../../core/schemas/vip.schema'
import { LoginDevice, LoginDeviceSchema } from '../../core/schemas/login-device.schema'

@Module({
    controllers: [
        IndexController
    ],
    providers: [
        IndexService
    ],
    imports: [
        MongooseModule.forFeature([
            { name: Code.name, schema: CodeSchema },
            { name: Bill.name, schema: BillSchema },
            { name: Order.name, schema: OrderSchema },
            { name: User.name, schema: UserSchema },
            { name: Proxy.name, schema: ProxySchema },
            { name: Taobao.name, schema: TaobaoSchema },
            { name: Paylist.name, schema: PaylistSchema },
            { name: GroupList.name, schema: GroupSchema },
            { name: Vip.name, schema: VipSchema },
            { name: LoginDevice.name, schema: LoginDeviceSchema },
        ])
    ]
})
export class IndexModule {}
