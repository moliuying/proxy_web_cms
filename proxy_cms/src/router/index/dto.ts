
import {IsNotEmpty, Length, IsString, Min,Max,IsInt, IsEmail, Matches} from 'class-validator'

export class BillDto {
    @IsNotEmpty({ message: '充值金额不能为空' })
    readonly money: number;

    // @IsNotEmpty({ message: '增加还是删除不能为空' }) //del add
    // readonly direction: string;
}





