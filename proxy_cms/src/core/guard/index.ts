import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<any>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const uid = request.headers['uid'];
        const token = request.headers['token'];

        if (!uid || !token) {
            throw new UnauthorizedException('未登录，请先登录');
        }

        const user = await this.UserModel.findOne({
            _id: uid,
            token,
            isDelete: false
        });

        if (!user) {
            throw new UnauthorizedException('登录已过期，请重新登录');
        }

        request.user = user;
        return true;
    }
}
