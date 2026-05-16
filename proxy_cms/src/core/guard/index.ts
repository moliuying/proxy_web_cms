import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<any>,
        @InjectModel('LoginDevice') private readonly LoginDeviceModel: Model<any>,
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
            isDelete: false
        });

        if (!user) {
            throw new UnauthorizedException('登录已过期，请重新登录');
        }

        const device = await this.LoginDeviceModel.findOne({
            userId: new Types.ObjectId(uid),
            deviceToken: token,
            isActive: true
        });

        if (!device) {
            if (user.token && user.token === token) {
                request.user = user;
                return true;
            }
            throw new UnauthorizedException('登录已过期，请重新登录');
        }

        await this.LoginDeviceModel.findByIdAndUpdate(device._id, {
            lastActiveAt: new Date()
        });

        request.user = user;
        request.deviceId = device._id;
        return true;
    }
}
