/* eslint-disable */
import {getManager} from 'typeorm';
let fs = require('fs');
let path = require('path');
// let {AlipaySdk} = require( 'alipay-sdk');
import AlipaySdk from 'alipay-sdk';
import {Injectable,Res} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import config from '../../config/base_config'

const qrImage = require('qr-image')
const request = require('request')
const crypto = require('crypto')
const moment = require('moment')

import {InjectConnection} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Taobao} from "../../core/schemas/taobao.schema";
import {Paylist} from "../../core/schemas/pay_list.schema";


@Injectable()
export class IndexService {
    // 注入模型
    constructor(
        @InjectModel('Bill') private readonly BillModel,
        @InjectModel('Order') private readonly OrderModel,
        @InjectModel('User') private readonly UserModel,
        @InjectModel('Proxy') private readonly ProxyModel,
        @InjectModel('Taobao') private readonly TaobaoModel,
        @InjectModel('Paylist') private readonly PaylistModel,
        @InjectModel('GroupList') private readonly GrouplistModel,
        @InjectConnection() private readonly connection: mongoose.Connection
    ) {
    }


    async setPort(body,header) {
        let users =   await this.UserModel.find()
        // console.log(users)
        for(let item of users){
            console.log(item._id)
            console.log(item.userName)
            let proxys =   await this.ProxyModel.find({uid: item._id.toString()})
            // console.log(proxys)
            let port = 0
            for(let index in proxys){
                port = (+index) + 1
                let item = proxys[index]
                if(item["chrome_port"] === 0){
                    console.log(port)
                    await this.ProxyModel.findByIdAndUpdate(item._id,{
                        chrome_port: port
                    })
                }
            }
        }

    }


    //添加代理
    async getProxyList(body,header) {
        let uid = header['uid']
        console.log({isDelete: false, uid, group_name: body.group_name})
        let obj = {
            isDelete: false, uid
        }
        if(body.group_name){
            obj['group_name'] = body.group_name
        }
        let items = await this.ProxyModel.find(obj);
        return { count: items.length, items }
    }


    //获取群组列表
    async getGroupList(body,header) {
        let uid = header['uid']
        let items = await this.GrouplistModel.find({isDelete: false, uid});
        // 每个群组下需要查询  覆盖了多少代理窗口


        const result = await this.GrouplistModel.aggregate([
            // 步骤1: 过滤符合条件的文档
            {
                $match: {
                    isDelete: false,
                    uid: uid
                }
            },
            // 步骤2: 关联成员表（假设为 GroupMemberModel）
            {
                $lookup: {
                    from: "proxies", // 成员集合名称（MongoDB 中的集合名）
                    localField: "group_name", // 分组表中的分组名字段
                    foreignField: "group_name", // 成员表中的分组名字段
                    as: "members" // 存储匹配成员的临时数组
                }
            },
            // 步骤3: 添加成员数量字段
            {
                $addFields: {
                    member_count: { $size: "$members" } // 计算成员数组长度
                }
            },
            // 步骤4: 移除临时成员数组（可选）
            {
                $project: {
                    members: 0 // 不返回 members 字段
                }
            },
            // 步骤5: 添加排序 - 按照 group_index 从大到小排序
            {
                $sort: {
                    group_index: -1 // -1 表示降序（从大到小）
                }
            }
        ]);

        return { count: result.length, items: result }
    }




    async addGroup(body,header) {
        let {group_name,group_index} = body
        let uid = header['uid']
        //先查看姓名是否存在
        let count = await this.GrouplistModel.count({group_name,isDelete:false})
        if(count){
            throw new Error("该分组名称已存在")
        }else {
            return await this.GrouplistModel.create({
                uid,
                group_name,
                group_index
            })
        }
    }

    //编辑代理
    async editGroup(body,header) {
        let {_id,group_name} = body
        delete body['_id']
        // let count = await this.GrouplistModel.count({group_name,isDelete:false})
        // if(count){
        //     throw new Error("该分组名称已存在")
        // }else {
        return await this.GrouplistModel.findByIdAndUpdate(_id,body)
        // }
    }

    async addProxyList(body,header) {
        let {dataArr} = body;
        console.log('body',body)
        console.log('dataArr',dataArr)
        return await this.ProxyModel.insertMany(dataArr)
    }

    //添加代理
    async addProxy(body,header) {
        let {proxy_name, group_name, proxy_ip,proxy_type,proxy_port,proxy_cookies,longitude,latitude,proxy_city} = body
        let uid = header['uid']

        let count = await this.ProxyModel.count({uid})
        let chrome_port = count
        return await this.ProxyModel.create({
            uid,
            proxy_name,
            group_name,
            proxy_ip,
            proxy_city,
            proxy_cookies,
            longitude,
            latitude,
            proxy_type,
            proxy_port,
            chrome_port
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


    async getPayList(body,header) {
        let uid = header['uid']
        let items = await this.PaylistModel.find({isDelete: false,parent: uid}).sort({'_id':-1})
        return { count:items.length, items }
    }


    async sureChangeShareVersion(body,header) {
        let uid = header['uid']
        let {parent, share_version} = body

        console.log(parent,share_version, typeof  share_version)
        return await this.PaylistModel.updateMany({isDelete: false,parent, share_version,share_type: 2 }, {share_type:3})
    }




    async getPayList2(body,header) {
        let uid = header['uid']
        let share_type = body["share_type"]
        let items = await this.PaylistModel.find({isDelete: false,parent: uid,share_type}).sort({'_id':-1})

        //把items 进行汇总整理成二级
        let arr = []
        for(let item of items){
            let data = await this.UserModel.findOne({isDelete: false,parent: uid})
            console.log(data)
            let obj = JSON.parse(JSON.stringify(item))
            obj["parentCellphone"] = data.cellphone
            arr.push(obj)
        }
        // console.log(items)
        return { count:items.length, items:arr }
    }

    async  sureApply(body,header) {
        //把当前用户的所有可提现金额进行 统计
        let share_version = 1
        let uid = header['uid']
        let count = await this.PaylistModel.count({isDelete: false, parent: uid})
        if(!count){
            throw new Error("暂无可提现数据")
        }
        let lastData = await this.PaylistModel.findOne({isDelete: false,parent: uid,share_type: 2}).sort({'_id':-1})
        console.log(lastData)
        if(lastData){
            share_version = lastData.share_version + 1
        }
        await this.PaylistModel.updateMany({isDelete: false,parent: uid,share_type:1},{share_type:2,share_version})
        return  1
    }

    async addOneRecod(body,header) {
        let uid = header['uid']

        //查他父级手机号
        let data = await this.UserModel.findOne({isDelete: false, _id:uid})
        if(data.parent){
            let data2 = await this.PaylistModel.findOne({isDelete: false, parent:  data.parent}).sort({_id:-1})
            let items = await this.PaylistModel.create({
                parent:  data.parent,
                uid,
                uCellphone: data.cellphone,
                orderNo: '47842108486767073771662537025307',
                orderTime: new Date(),
                record_money: 498,
                share_money: 0,
                share_type: 1,
                share_version: 0,
            })
        }

        return 1
    }

    async getApplyList(body,header) {
        let page = body['page']
        let uid = header['uid']
        let count = await this.UserModel.count({isDelete: false, parent: uid})
        let items = await this.UserModel.find({parent: uid}).skip(page > 0 ? ((page - 1) * 10) : 0).limit(1000).sort({'_id':-1})
        return { count, items }
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
        if(money != 896 && money != 4398 && money != 1298 && money != 498 && money != 2199
          && money != 398 && money != 798 && money != 1698
        ){
            throw new Error("警告，你的IP行为已被记录，充值金额有误，请规范充值金额")
        }
        let uid = header['uid']
        //直接创建订单  拼接参数发给VX获取支付二维码返回给前端
        let orderNo = config.GenerateRandomDigit(19) + new Date().valueOf()
        await this.OrderModel.create({uid, orderNo, money, type, custom_days})
        const privateKeyPath = path.resolve(__dirname, '../../..', 'key', 'privateKey.txt')
        const alipayPublicKeyPath = path.resolve(__dirname, '../../..', 'key', 'alipayPublicKey.txt')

        if (!fs.existsSync(privateKeyPath)) {
            throw new Error(`支付宝私钥文件缺失或路径错误：${privateKeyPath}`)
        }
        if (!fs.existsSync(alipayPublicKeyPath)) {
            throw new Error(`支付宝公钥文件缺失或路径错误：${alipayPublicKeyPath}`)
        }

        const alipaySdk = new AlipaySdk({
            // 设置应用 ID
            appId: '2021006103648359',  //https://business.alipay.com/page/app-manage/bindapp?applicationType=%5B%22WEBAPP%22%5D
            // 设置应用私钥
            privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
            // 设置支付宝公钥
            alipayPublicKey: fs.readFileSync(alipayPublicKeyPath, 'utf8'),
        });
        async function  createOrder () {
            const result = await alipaySdk.pageExec("alipay.trade.page.pay", {
                notify_url: 'https://cms.bianselongzw.com/index/receive_zfb_info',
                bizContent: {
                    out_trade_no: orderNo,
                    total_amount: money.toString(),
                    // total_amount: 0.01.toString(),
                    subject: "变色龙软件会员充值",
                    product_code: "FAST_INSTANT_TRADE_PAY",
                    qr_pay_mode: "0",
                    // qr_pay_mode: "4",
                    // qrcode_width: 100,
                },
            });
            return result;
        }
        let qrCodeData = await createOrder()
        console.log(qrCodeData)
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

        // 创建分佣表

        let data1 = await this.UserModel.findOne({isDelete: false, _id:uid})
        if(data1.parent){
            let data2 = await this.PaylistModel.findOne({isDelete: false, parent:  data1.parent}).sort({_id:-1})
            await this.PaylistModel.create({
                parent:  data1.parent,
                uid,
                uCellphone: data1.cellphone,
                orderNo: out_trade_no,
                orderTime: new Date(),
                record_money: money,
                share_money: 0,
                share_type: 1,
                share_version: 0,
            })
        }


        await this.PaylistModel.create({
            parent: '63184d16b6b9fc06a00bdfae',
            uid,
            uCellphone: data.cellphone,
            orderNo: out_trade_no,
            orderTime: new Date(),
            record_money: money,
            share_money: 0,
            share_type: 1,
            share_version: 0,
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


    async receive_zfb_info(body) {
        console.log("222 receive_zfb_info---")
        console.log(body)
        console.log(typeof body)
        let out_trade_no = body["out_trade_no"]
        console.log(out_trade_no)
        // //检查
        let order_log_info = await this.OrderModel.findOne({
            isDelete: false,
            orderNo: out_trade_no,
            ifGetVxResponse: false
        })
        let money = parseFloat(String(body["total_amount"]))
        let uid = order_log_info["uid"]
        let recordUserInfo = await this.UserModel.findOne({isDelete: false, _id: uid})
        // 支付成功  增加用户金额 更新订单信息
        //1 更新订单表 微信支付信息
        console.log("uid",uid)
        await this.OrderModel.findOneAndUpdate({orderNo: out_trade_no}, {ifGetVxResponse: true, vxResponseInfo: JSON.stringify(body)})
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

