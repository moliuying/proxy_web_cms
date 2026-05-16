import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from 'typeorm';
import {IsString} from 'class-validator';
// import {UserEntity} from './user.entity'

export enum Specific {
    None = 0,
    UI
}

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Column()
    name: string;

    // @ManyToMany(() => UserEntity)
    // @JoinTable()
    // administrators: UserEntity[];
    //
    // @ManyToMany(() => UserEntity)
    // @JoinTable()
    // members: UserEntity[];
    //
    // @Column({default: Specific.None})
    // specific: Specific;
}

