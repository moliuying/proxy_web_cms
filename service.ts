import {getManager} from 'typeorm';
import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import config from '../../config/base_config'

const qrImage = require('qr-image')
const request = require('request')
const crypto = require('crypto')
const moment = require('moment')

import {InjectConnection} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Taobao} from "../../core/schemas/taobao.schema";


@Injectable()
export class IndexService {
    // 注入模型
    constructor(
        @InjectModel('Bill') private readonly BillModel,
        @InjectModel('Order') private readonly OrderModel,
        @InjectModel('User') private readonly UserModel,
        @InjectModel('Proxy') private readonly ProxyModel,
        @InjectModel('Taobao') private readonly TaobaoModel,
        @InjectConnection() private readonly connection: mongoose.Connection
    ) {
    }

    //添加代理
    async getProxyList(body,header) {
        let uid = header['uid']
        let items = await this.ProxyModel.find({isDelete: false, uid})
        return { count: items.length, items }
    }

    //添加代理
    async addProxy(body,header) {
        let {proxy_name,proxy_ip,proxy_type,proxy_port} = body
        let uid = header['uid']
        return await this.ProxyModel.create({
            uid,
            proxy_name,
            proxy_ip,
            proxy_type,
            proxy_port
        })
    }

    //删除代理
    async delProxy(body,header) {
        let {_id} = body
        let uid = header['uid']
        return await this.ProxyModel.findByIdAndUpdate(_id,{  isDelete: true })
    }

    //编辑代理
    async editProxy(body,header) {
        let {_id} = body
        delete body['_id']
        return await this.ProxyModel.findByIdAndUpdate(_id,body)
    }


    async getBills(body,header) {
        let page = body['page']
        let uid = header['uid']
        let count = await this.BillModel.count({isDelete: false, uid})
        let items = await this.BillModel.find({uid}).skip(page > 0 ? ((page - 1) * 10) : 0).limit(1000).sort({'_id':-1})
        return { count, items }
    }

    async checkOrderNo(body, header) {
        // 检测是否已存在
        let {orderNo} = body
        let uid = header['uid']
        let data = await this.OrderModel.findOne({isDelete: false, orderNo, uid})
        return data
    }

    async getQrcode(body, header) {
        // 检测是否已存在
        let {money, type, custom_days} = body
        if(money != 4398 && money != 1298 && money != 498){
            throw new Error("警告，你的IP行为已被记录，充值金额有误，请规范充值金额")
        }
        let uid = header['uid']
        //直接创建订单  拼接参数发给VX获取支付二维码返回给前端
        let orderNo = config.GenerateRandomDigit(19) + new Date().valueOf()
        let base_param = {
            appid: config.appid,
            mchid: config.mchid,
            description: "北极狐充值",
            out_trade_no: orderNo,
            notify_url: "http://beijihunb.com:5000/index/receive_vx_info",
        }
        await this.OrderModel.create({uid, orderNo, money, type, custom_days})
        const requestBody = Object.assign(base_param, {amount: {"total": money * 100}})
        // console.log("requestBody",requestBody)
        let qrCodeData = await new Promise((resolve, reject) => {
            request({
                url: config.vx_base_url + config.vx_pay_url,// 总包已建
                method: "POST",//请求方式，默认为get
                headers: {//设置请求头
                    'Authorization': config.get_Authorization('POST\n/v3/pay/transactions/native', requestBody),
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'User-Agent': 'Mozilla/4.0 (compatible MSIE 6.0 Windows NT 5.1 SV1 .NET CLR 2.0.50727 .NET CLR 3.0.04506.648 .NET CLR 3.5.21022)',
                },
                body: JSON.stringify(requestBody),
                timeout: 30 * 1000,
            }, (error, response, body) => {
                if (!error) {
                    console.log(JSON.parse(body))
                    if (JSON.parse(body)["code_url"]) {
                        let code_url = JSON.parse(body)["code_url"]
                        let res = qrImage.imageSync(code_url, {type: 'png', parse_url: true})
                        resolve(res)
                    }
                } else {
                    console.log(error)
                }
            })
        })
        return {orderNo, qrCodeData}
    }

    async receive_vx_info(body) {
        console.log("receive_vx_info---")
        var cipherText = body["resource"]["ciphertext"]
        var iv = body["resource"]["nonce"]
        var associated_data = body["resource"]["associated_data"]
        let rst = ''
        cipherText = Buffer.from(cipherText, 'base64')
        let authTag = cipherText.slice(cipherText.length - 16)
        let data = cipherText.slice(0, cipherText.length - 16)
        let decipher = crypto.createDecipheriv('aes-256-gcm', config.vx_apiv3_miyao, iv)
        decipher.setAuthTag(authTag)
        decipher.setAAD(Buffer.from(associated_data))
        rst = decipher.update(data, 'binary', 'utf8')
        rst += decipher.final('utf-8')
        let vx_back_obj = JSON.parse(rst)
        // console.log(vx_back_obj)
        // let rst = "123456"
        // let vx_back_obj = {
        //     mchid: '1630125691',
        //     appid: 'wx7c49f81c79b1e5c0',
        //     out_trade_no: '15963252393301519871663232399982',
        //     transaction_id: '4200001562202209059189159504',
        //     trade_type: 'NATIVE',
        //     trade_state: 'SUCCESS',
        //     trade_state_desc: '支付成功',
        //     bank_type: 'COMM_CREDIT',
        //     attach: '',
        //     success_time: '2022-09-05T16:16:33+08:00',
        //     payer: {openid: 'ocD2p6CLmJY2xt6p0Dv-oMAFlYVM'},
        //     amount: {total: 1, payer_total: 1, currency: 'CNY', payer_currency: 'CNY'}
        // }
        let out_trade_no = vx_back_obj["out_trade_no"]
        //检查
        let order_log_info = await this.OrderModel.findOne({
            isDelete: false,
            orderNo: out_trade_no,
            ifGetVxResponse: false
        })
        let money = parseFloat(String(vx_back_obj["amount"]["total"] / 100))
        let uid = order_log_info["uid"]
        let recordUserInfo = await this.UserModel.findOne({isDelete: false, _id: uid})
        // 支付成功  增加用户金额 更新订单信息
        //1 更新订单表 微信支付信息
        console.log("uid",uid)
        await this.OrderModel.findOneAndUpdate({orderNo: out_trade_no}, {ifGetVxResponse: true, vxResponseInfo: rst})
        //2 增加用户金额 过期时间
        let expireDate = moment(recordUserInfo.expireDate || new Date())
        if( moment(expireDate).isBefore(  moment(new Date()) ) ){
            expireDate = moment(new Date())
        }
        let custom_days = order_log_info.custom_days
        expireDate = moment(expireDate).add(custom_days, 'days').format("YYYY-MM-DD")
        await this.UserModel.findOneAndUpdate({isDelete: false, _id: uid}, {
            yue: (+recordUserInfo.yue) + money,
            expireDate: expireDate
        })
        //3 创建 bill账单 表
        await this.BillModel.create({
            recordWay: 1,
            orderNo: out_trade_no,
            prev_money: recordUserInfo.yue,
            add_money: money,
            now_money: (+recordUserInfo.yue) + money,
            custom_days,
            uid: uid
        })
        // if (order_log_info && vx_back_obj["trade_state"] == 'SUCCESS' && vx_back_obj["trade_state_desc"] == '支付成功') {
        //     const transactionSession = await this.connection.startSession()
        //     transactionSession.startTransaction()
        //     try{
        //         //1 更新订单表 微信支付信息
        //         await this.OrderModel.findOneAndUpdate( { orderNo: out_trade_no},{ ifGetVxResponse: true, vxResponseInfo: rst }).session(transactionSession).exec()
        //         //2 增加用户金额
        //         await this.UserModel.findOneAndUpdate( { isDelete: false, uid },{ yue:  (+recordUserInfo.yue) + money }).session(transactionSession).exec()
        //         //3 创建 bill账单 表
        //         // await this.BillModel.create({ prev_money: recordUserInfo.yue, add_money: money, now_money: (+recordUserInfo.yue) + money+'--',  uid: uid }).session(transactionSession)
        //         await this.BillModel.create({ prev_money: recordUserInfo.yue, add_money: money, now_money: (+recordUserInfo.yue) + money,  uid: uid }).session(transactionSession).exec()
        //         transactionSession.commitTransaction()
        //     }catch (err) {
        //         console.log("err",err)
        //         console.log("transactionSession",transactionSession)
        //         transactionSession.abortTransaction()
        //         throw err
        //     } finally{
        //         transactionSession.endSession()
        //     }
        // }
    }

    async exportInExcel(body, header) {
        // 检测是否已存在
        let {arr,version} = body
        let count = await this.TaobaoModel.count({version,isDelete:false})
        if(count){
            throw new Error("采集批次已存在")
        }else {
            return await this.TaobaoModel.insertMany(arr)
        }

    }

    async getOneTaoBaoData(body, header) {
        // 检测是否已存在
        let {version,skip} = body
        let allVersionCount = await this.TaobaoModel.count({version})
        let alreadyCount = await this.TaobaoModel.count({version, isScrapy:true})
        return {
            row: await this.TaobaoModel.findOne({version, isScrapy:false}).skip(skip),
            allVersionCount,
            alreadyCount,
        }
    }
    async updateOneTaoBaoData(body, header) {
        // 检测是否已存在
        let {_id,isPipei,desc} = body
        return await this.TaobaoModel.findByIdAndUpdate(_id,{isScrapy: true,isPipei,desc})
    }
    async getAllTaoBaoData(body, header) {
        // 检测是否已存在
        let {version} = body
        return await this.TaobaoModel.find({version, isScrapy:true})
    }

}

