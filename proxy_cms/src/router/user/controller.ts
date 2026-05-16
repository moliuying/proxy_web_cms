import { Controller,Get,Post,Put,Delete, Headers,Body,Query,Param,HttpException,HttpStatus,UseInterceptors,UseGuards,UsePipes,Request } from '@nestjs/common';
import { UserService } from './service'
import { User } from './interfaces/index'
import { Observable } from 'rxjs'
import {  UserRegisterDto,UserLoginDto,UserPwdDto } from "./dto";
import { ValidationPipe } from '../../core/pipe/validation.pipe';
import { AuthGuard } from '../../core/guard';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}


    // 登录接口
    @Post('send_cms_code')
    @UsePipes(new ValidationPipe())
    async send_cms_code(@Body() body,@Headers() Headers): Promise<any>{
        return  this.userService.send_cms_code(body,Headers)
    }

    // 登录接口
    @Post('changePwd')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async changePwd(@Body() body: UserPwdDto,@Headers() Headers): Promise<any>{
        return  this.userService.changePwd(body,Headers)
    }

    // 登录接口
    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() body: UserLoginDto, @Headers() headers, @Request() req): Promise<Observable<User>>{
        return  this.userService.login(body, headers, req)
    }

    // pdd接口
    @Post('getPddScrapy')
    @UseGuards(AuthGuard)
    async getPddScrapy(@Body() body: UserLoginDto): Promise<any>{
        return  this.userService.getPddScrapy()
    }



    // 注册接口
    @Post('forgot_pwd')
    @UsePipes(new ValidationPipe())
    async forgot_pwd(@Body() body): Promise<any>{
        return  this.userService.forgot_pwd(body)
    }


    // 注册接口
    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() body): Promise<any>{
        return  this.userService.register(body)
    }

    @Post('get_vip_codes')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async get_vip_codes(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.get_vip_codes(body, headers)
    }

    @Post('delVipCode')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async delVipCode(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.delVipCode(body,headers)
    }

    @Post('activateVipCode')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async activateVipCode(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.activateVipCode(body,headers)
    }

    @Post('getUserActivateRecords')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async getUserActivateRecords(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.getUserActivateRecords(body,headers)
    }


    // 批量生成激活码
    @Post('addVipCode')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async addVipCode(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.addVipCode(body,headers)
    }



    @Post('addOneUser')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async addOneUser(@Body() body : UserRegisterDto,@Headers() headers): Promise<Observable<User>>{
        return  this.userService.addOneUser(body,headers)
    }

    @Post('delOneUser')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async delOneUser(@Body() body,@Headers() headers): Promise<Observable<User>>{
        return  this.userService.delOneUser(body,headers)
    }





    //查询个人信息
    @Post('get_userinfo')
    @UseGuards(AuthGuard)
    async get_userinfo(@Headers() headers): Promise<Observable<User>>{
        return  this.userService.get_userinfo(headers)
    }

    // 获取登录设备列表
    @Post('get_login_devices')
    @UseGuards(AuthGuard)
    async getLoginDevices(@Headers() headers): Promise<any>{
        return  this.userService.getLoginDevices(headers)
    }

    // 踢出设备
    @Post('kick_device')
    @UseGuards(AuthGuard)
    async kickDevice(@Body() body, @Headers() headers): Promise<any>{
        return  this.userService.kickDevice(body, headers)
    }

    //查询所有用户
    @Post('get_users')
    @UseGuards(AuthGuard)
    async get_users(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.get_users(body,headers)
    }


    //查询所有用户
    @Post('sureSetExpireDate')
    @UseGuards(AuthGuard)
    async sureSetExpireDate(@Body() body,@Headers() headers): Promise<any>{
        return  this.userService.sureSetExpireDate(body,headers)
    }

    //设置用户名称
    @Post('set_campany')
    @UseGuards(AuthGuard)
    async set_campany(@Body() body,@Headers() headers): Promise<any>{
        console.log(123)
        return  this.userService.set_campany(body,headers)
    }





    // @Post('getQrCode')
    // async getQrCode(@Body() body): Promise<Observable<User>>{
    //     return  this.userService.getQrCode(body)
    // }

    // @Get('getList:id')
    // getList( @Param() Param, @Query() query,  @Body() Body, @Headers() Headers): string {
    //     console.log("ParamId",Param)
    //     console.log("query",query)
    //     console.log("Body",Body)
    //     console.log("Headers",Headers)
    //     return '返回用户列表';
    // }
    //
    // @Post('login')
    // login(): string {
    //     return '用户登录';
    // }
    // @Post('create')
    // create(@Body() body : User): Observable<User>{
    //     return  this.userService.create(
    //         {
    //             cellphone: body.cellphone,
    //             name: body.name,
    //             age: body.age
    //         }
    //     )
    // }
    //
    // @Put('update')
    // update(@Body() body : User): Observable<UpdateResult>{
    //
    //     // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //
    //     let id = body.id
    //     delete body.id
    //     for(let key in body){
    //         if(!body[key]){
    //             delete body[key]
    //         }
    //     }
    //     console.log(body)
    //     return  this.userService.update(
    //         id,
    //         body
    //     )
    // }
    //
    // @Delete('del')
    // del(@Body() body): Observable<DeleteResult>{
    //     let id = body.id
    //     return  this.userService.del( id )
    // }
    //
    // @Post('findAll')
    // findAll(): Observable<User []> {
    //     // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //     // throw new HttpException({
    //     //     status: HttpStatus.FORBIDDEN,
    //     //     error: 'This is a custom message',
    //     // }, HttpStatus.FORBIDDEN);
    //     return this.userService.findAll()
    // }
}
