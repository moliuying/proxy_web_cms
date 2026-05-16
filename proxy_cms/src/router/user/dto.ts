
import {IsNotEmpty, Length, IsString, Min,Max,IsInt, IsEmail, Matches} from 'class-validator'

export class UserLoginDto {
    @IsNotEmpty({ message: '手机号不能为空' })
    @Matches(/^1[3456789]\d{9}$/, { message: '手机号格式不正确' })
    readonly cellphone: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @Length(6, 12)
    password: string;
}

export class UserRegisterDto extends  UserLoginDto{
    @IsNotEmpty({ message: '用户名不能为空' })
    userName:string;
}



export class UserPwdDto {
    @IsNotEmpty({ message: '原始不能为空' })
    @Length(6, 12)
    readonly old_password: string;

    @IsNotEmpty({ message: '新密码不能为空' })
    @Length(6, 12)
    password1: string;
}


