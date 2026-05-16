import {Module} from '@nestjs/common';
import {uri} from './config/uri'
import {TypeOrmModuleOptions} from '@nestjs/typeorm'


import {UserModule} from './router/user/module';
import {IndexModule} from './router/index/module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => ({
                uri
            })
        }),
        // TypeOrmModule.forRoot(mongo),
        // // TypeOrmModule.forFeature([
        // //     // UserEntity,
        // //     // Team,
        // // ]),
        UserModule,
        IndexModule
        // MongooseModule.forFeature([{name:'user',schema:UserSchema}])
    ],
    controllers: []
})
export class AppModule {
}
