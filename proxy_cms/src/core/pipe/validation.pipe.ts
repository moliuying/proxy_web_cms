import {ArgumentMetadata, Injectable, PipeTransform, BadRequestException} from '@nestjs/common';
import {validate} from 'class-validator';
import {plainToClass} from 'class-transformer';

// import { Logger } from '../utils/log4js';

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(data: any, {metatype}: ArgumentMetadata) {
        for(let key in data){
            if( Object.prototype.toString.call(data[key])=="[object String]" ){
                data[key] = data[key].trim()
            }
        }
        if (!metatype || !this.toValidate(metatype)) {
            // 如果没有传入验证规则，则不验证，直接返回数据
            return data;
        }
        // 将对象转换为 Class 来验证
        const object = plainToClass(metatype, data);
        const errors = await validate(object);
        if (errors.length > 0) {
            const msg = Object.values(errors[0].constraints); // 只需要取第一个错误信息并返回即可
            // Logger.error(`Validation failed: ${msg}`);
            throw new BadRequestException(`${msg[msg.length-1]}`);
        }
        return data;
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
