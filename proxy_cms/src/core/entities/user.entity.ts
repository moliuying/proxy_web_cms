
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type UserDocument = User & Document;

@Schema()
export class User extends Document{


    @Prop()
    name:string;

    @Prop()
    phone:string;

    @Prop()
    password:string;

    @Prop()
    sex:number;

}

export const UserSchema = SchemaFactory.createForClass(User)


// import {
//     Entity,
//     EntitySchema,
//     Column,
//     ObjectIdColumn,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     BeforeInsert,
//     BeforeUpdate
// } from 'typeorm';



//
// export const UserEntity = new EntitySchema({
//     name: 'proxy_user',
//     columns:{
//         id:{
//             type: Number,
//             primary: true,
//             generated: true
//         },
//         name:{
//             type: String
//         },
//         address: {
//             type: String
//         }
//     }
// })

// @Entity('proxy_user')
// export class UserEntity {
//     @ObjectIdColumn()
//     // @PrimaryGeneratedColumn()
//     id: number;
//
//     @Column({default: '暂无', unique: true})
//     cellphone: string;
//
//
//     @Column({default: ''})
//     userName: string;
//
//     @Column({default: ''})
//     password: string;
//
//     @Column({default: ''})
//     address: string;
//
//     @Column({default: 0})
//     age: number;
//
//     @Column({default: false})
//     is_delete: boolean;
//
//
//     @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
//     createdAt: Date;
//
//     @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
//     updateAt: Date;
// }
