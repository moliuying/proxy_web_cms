/* eslint-disable */
import { Controller,Get,Post,Res,Put,Delete, Headers,Body,Query,Param,HttpException,HttpStatus,UseInterceptors,ParseArrayPipe,UsePipes,UseGuards } from '@nestjs/common';
import { IndexService } from './service'
import { Bill } from './interfaces/index'
import { Observable } from 'rxjs'
import { BillDto } from "./dto";
import {ValidationPipe} from "../../core/pipe/validation.pipe";
import { AuthGuard } from '../../core/guard';


@Controller('index')
export class IndexController {
    constructor(private indexService: IndexService) {}

    //添加窗口代理
    @Get('test')
    test(@Res() res) {
        // 你的逻辑...
        // 基于某些条件决定是否重定向
        console.log("enter")
        // res.redirect(302, 'https://baidu.com');
        // res.redirect(302, 'https://fushi-3gpv4hf46ea0bcd7-1308466801.tcloudbaseapp.com/h5/jump-mp-test.html');
        res.redirect(302, 'weixin://dl/business/?t=e24B7Ahc3Qk');
    }

    //添加窗口代理
    @Post('setPort')
    @UseGuards(AuthGuard)
    async setPort(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.setPort(body,Headers)
    }


    //添加窗口代理
    @Post('getProxyOne')
    @UseGuards(AuthGuard)
    async getProxyOne(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getProxyOne(body,Headers)
    }


    //添加窗口代理
    @Post('getProxyList')
    @UseGuards(AuthGuard)
    async getProxyList(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getProxyList(body,Headers)
    }

    //添加窗口代理

    @Post('getGroupList')
    @UseGuards(AuthGuard)
    async getGroupList(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getGroupList(body,Headers)
    }

    //添加窗口代理
    @Post('addProxy')
    @UseGuards(AuthGuard)
    async addProxy(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.addProxy(body,Headers)
    }
    @Post('delProxy')
    @UseGuards(AuthGuard)
    async delProxy(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.delProxy(body,Headers)
    }

    @Post('editProxy')
    @UseGuards(AuthGuard)
    async editProxy(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.editProxy(body,Headers)
    }




    @Post('addProxyList')
    @UseGuards(AuthGuard)
    async addProxyList(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.addProxyList(body,Headers)
    }

    @Post('addGroup')
    @UseGuards(AuthGuard)
    async addGroup(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.addGroup(body,Headers)
    }
    // @Post('delGroup')
    // async Group(@Body() body,@Headers() Headers): Promise<any>{
    //     // @ts-ignore
    //     return  this.indexService.Group(body,Headers)
    // }
    //
    @Post('editGroup')
    @UseGuards(AuthGuard)
    async editGroup(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.editGroup(body,Headers)
    }


    // 登录接口
    @Post('getQrcode')
    @UsePipes(new ValidationPipe())
    async getQrcode(@Body() body: BillDto, @Headers() headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getQrcode(body,headers)
    }


    //接收微信通知
    @Post('receive_vx_info')
    async receive_vx_info(@Body() body): Promise<any>{
        // @ts-ignore
        return  this.indexService.receive_vx_info(body)
    }

    @Post('receive_zfb_info')
    async receive_zfb_info(@Body() body): Promise<any>{
        // @ts-ignore
        return  this.indexService.receive_zfb_info(body)
    }


    //获取账单信息
    @Post('getBills')
    @UseGuards(AuthGuard)
    async getBills(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getBills(body,Headers)
    }


    //获取账单信息
    @Post('getApplyList')
    @UseGuards(AuthGuard)
    async getApplyList(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getApplyList(body,Headers)
    }


    //获取账单信息
    @Post('addOneRecod')
    @UseGuards(AuthGuard)
    async addOneRecod(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.addOneRecod(body,Headers)
    }

    //获取账单信息
    @Post('sureApply')
    @UseGuards(AuthGuard)
    async sureApply(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.sureApply(body,Headers)
    }






    @Post('getPayList')
    @UseGuards(AuthGuard)
    async getPayList(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getPayList(body,Headers)
    }


    @Post('getPayList2')
    @UseGuards(AuthGuard)
    async getPayList2(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getPayList2(body,Headers)
    }

    @Post('sureChangeShareVersion')
    @UseGuards(AuthGuard)
    async sureChangeShareVersion(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.sureChangeShareVersion(body,Headers)
    }







    //获取账单信息
    @Post('checkOrderNo')
    @UseGuards(AuthGuard)
    async checkOrderNo(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.checkOrderNo(body,Headers)
    }

    @Post('exportInExcel')
    @UseGuards(AuthGuard)
    async exportInExcel(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.exportInExcel(body,Headers)
    }

    @Post('getOneTaoBaoData')
    @UseGuards(AuthGuard)
    async getOneTaoBaoData(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore

        return  this.indexService.getOneTaoBaoData(body,Headers)
    }

    @Post('updateOneTaoBaoData')
    @UseGuards(AuthGuard)
    async updateOneTaoBaoData(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.updateOneTaoBaoData(body,Headers)
    }

    @Post('getAllTaoBaoData')
    @UseGuards(AuthGuard)
    async getAllTaoBaoData(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getAllTaoBaoData(body,Headers)
    }

    @Post('getDashboardStats')
    @UseGuards(AuthGuard)
    async getDashboardStats(@Body() body,@Headers() Headers): Promise<any>{
        // @ts-ignore
        return  this.indexService.getDashboardStats(body,Headers)
    }

}
