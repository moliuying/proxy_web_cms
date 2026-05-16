import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
const moment = require('moment')
import { passwordToMd5 } from '../../utils'

@Injectable()
export class UserService {
    // 注入模型
    constructor(
        @InjectModel('User') private readonly UserModel,
        @InjectModel('Order') private readonly OrderModel,
        @InjectModel('Code') private readonly CodeModel,
        @InjectModel('Vip') private readonly VipModel,
        @InjectModel('Bill') private readonly BillModel,
    ) {}

    async sureSetExpireDate(body,header) {
        let {_id,expireDate} = body
        await this.UserModel.findByIdAndUpdate(_id,{expireDate})
    }


    async set_campany(body,headers) {
        let {_id, companyName,roleType} = body
        await this.UserModel.findByIdAndUpdate(_id,{companyName,roleType})
    }

    async get_users(body,headers) {
        let { page = 1, cellphone } = body
        console.log( page,'----   ')
        // 检测是否已存在
        let query = {
            isDelete: false
        }
        if(cellphone){
            query["cellphone"] = cellphone
        }
        // 检测自己集团下的
        // 首先看是不是我 或者 李总
        let uid = headers['uid']
        console.log('uid', uid)

        //检测是否超管 并且  拥有企业
        if( uid !== '63184d16b6b9fc06a00bdfae' &&  uid !== '632191bed59dcc0a0f2abf46' ){
            // query["cellphone"] = cellphone
            let data =  await this.UserModel.findOne({
                isDelete: false,
                _id: uid
            })
            if(data['roleType'] != 1){
                throw new Error("你的行为已被记录，你无权访问")
            }else{
                if(!data['companyName']){
                    throw new Error("你的企业名称不完善，请联系管理员补充")
                }else{
                    query['companyName'] = data['companyName']
                }
            }
            console.log("data",data)
        }
        console.log(query)

        let total = await this.UserModel.count(query)
        let tableData = await this.UserModel.find(query)
            .skip(page > 0 ? ((page - 1) * 10) : 0)
            .limit(10).sort({'_id':-1})

        let arr = []
        for(let item of tableData){
            item = item.toObject()
            item["recordTime"] = null
            console.log(item._id)
            let record = await this.OrderModel.findOne({ifGetVxResponse: true, uid: item._id.toString()})
                .sort({ _id: -1 }) // 替换成你要排序的字段和顺序（1代表升序，-1代表降序）
                .limit(1)
            // console.log(record)
            if(record){
                // console.log(record)
                item["recordTime"] = record["createdAt"]
                // console.log(item)
            }
            arr.push(item)
        }
        return {
            total,
            tableData: arr
        }

    }

    async delOneUser(body,headers) {
        let {_id} = body
        console.log(_id)
        return await this.UserModel.findByIdAndUpdate(_id,{isDelete: true})
    }

    async addOneUser(body,headers) {
        if(body.password){
            body.password = passwordToMd5(body.password)
        }
        // 检测是否已存在
        let count =  await this.UserModel.count({ isDelete: false, cellphone: body.cellphone })
        if(count){
            throw new Error("用户已存在")
        }


        let uid = headers['uid']
        let data =  await this.UserModel.findOne({
            isDelete: false,
            _id: uid
        })
        body['companyName'] = data['companyName']
        return await this.UserModel.create(body)
    }

    async send_cms_code(body,header){
        // 指定短信验证码发送操作
        // 检测是否已存在
        let count =  await this.UserModel.count({ isDelete: false, cellphone: body.cellphone })
        if(body.type == '1'){
            if(count){
                throw new Error("用户已存在")
            }
        }else{
            if(!count){
                throw new Error("用户不存在")
            }
        }

        function generateVerificationCode() {
            return Math.floor(100000 + Math.random() * 900000);
        }
        var verificationCode = generateVerificationCode();
        // 调用短信服务

        const tencentcloud = require("tencentcloud-sdk-nodejs")
        // 导入对应产品模块的client models。
        const smsClient = tencentcloud.sms.v20210111.Client
        /* 实例化要请求产品(以sms为例)的client对象 */
        const client = new smsClient({
            credential: {
                /* 为了保护密钥安全，建议将密钥设置在环境变量中或者配置文件中。
                 * 硬编码密钥到代码中有可能随代码泄露而暴露，有安全隐患，并不推荐。
                 * SecretId、SecretKey 查询: https://console.cloud.tencent.com/cam/capi */
                secretId: process.env.TENCENT_SECRET_ID || '',
                secretKey: process.env.TENCENT_SECRET_KEY || '',
            },
            /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
            region: "ap-beijing",
        })

        /* 请求参数，根据调用的接口和实际情况，可以进一步设置请求参数
         * 属性可能是基本类型，也可能引用了另一个数据结构
         * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
        /* 帮助链接：
         * 短信控制台: https://console.cloud.tencent.com/smsv2
         * 腾讯云短信小助手: https://cloud.tencent.com/document/product/382/3773#.E6.8A.80.E6.9C.AF.E4.BA.A4.E6.B5.81 */
        const params = {
            /* 短信应用ID: 短信SdkAppId在 [短信控制台] 添加应用后生成的实际SdkAppId，示例如1400006666 */
            // 应用 ID 可前往 [短信控制台](https://console.cloud.tencent.com/smsv2/app-manage) 查看
            SmsSdkAppId: "1400988751", //变色龙
            /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名 */
            // 签名信息可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-sign) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-sign) 的签名管理查看
            SignName: "漯河畅伦网络",
            /* 模板 ID: 必须填写已审核通过的模板 ID */
            // 模板 ID 可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-template) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-template) 的正文模板管理查看
            TemplateId: body.type == '1'? "2431016": '2431018', //1注册 2忘记密码
            /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
            TemplateParamSet: [verificationCode.toString()],
            /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
             * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
            PhoneNumberSet: ["+86"+(body.cellphone).toString()],
        }

        console.log({
            /* 短信应用ID: 短信SdkAppId在 [短信控制台] 添加应用后生成的实际SdkAppId，示例如1400006666 */
            // 应用 ID 可前往 [短信控制台](https://console.cloud.tencent.com/smsv2/app-manage) 查看
            SmsSdkAppId: "1400988751", //变色龙
            /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名 */
            // 签名信息可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-sign) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-sign) 的签名管理查看
            SignName: "漯河畅伦网络",
            /* 模板 ID: 必须填写已审核通过的模板 ID */
            // 模板 ID 可前往 [国内短信](https://console.cloud.tencent.com/smsv2/csms-template) 或 [国际/港澳台短信](https://console.cloud.tencent.com/smsv2/isms-template) 的正文模板管理查看
            TemplateId: body.type == '1'? "2431016": '2431018', //1注册 2忘记密码
            /* 模板参数: 模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致，若无模板参数，则设置为空 */
            TemplateParamSet: [verificationCode.toString()],
            /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
             * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
            PhoneNumberSet: ["+86"+(body.cellphone).toString()],
        })
// 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
        client.SendSms(params, function (err, response) {
            // 请求异常返回，打印异常信息
            if (err) {
                console.log(err)
                return
            }
            // 请求正常返回，打印response对象
            console.log(response)
        })
        await this.CodeModel.create({
            cellphone: body.cellphone,
            code: verificationCode
        })
        return {
            status: 'ok'
        }
    }

    async changePwd(body,header) {
        // 验证原密码是否正确
        if(body.password1 != body.password2){
            throw new Error("用户新密码不一致")
        }
        let uid = header['uid']
        let count = await this.UserModel.count({
            isDelete: false,
            password: passwordToMd5(body.old_password),
            uid
        })
        if(!count){
            throw new Error("原始密码不正确")
        }else{
            // 执行更新
            let password = passwordToMd5(body.password1)
            let res = await this.UserModel.findByIdAndUpdate(uid,{password})
            console.log(res,'res')
            if(res){
                return {
                    data: 'success'
                }
            }
        }

        // return await this.UserModel.create(body)
    }

    async forgot_pwd(body){
        try {
            if (body.password) {
                body.password = passwordToMd5(body.password);
            }

            // 检测是否已存在
            let count = await this.UserModel.count({ isDelete: false, cellphone: body.cellphone });
            if (!count) {
                throw new Error("用户不存在");
            }
            console.log('---')
            // 检测验证码是否正确
            let res = await this.CodeModel.findOne({
                isDelete: false,
                cellphone: body.cellphone
            }).sort({ _id: -1 })
            console.log('验证码查询结果:', res);
            if (!res) {
                throw new Error("验证码不存在");
            }

            console.log('服务器验证码:', res.code.toString());
            console.log('用户输入验证码:', body.code.toString());

            if (res.code.toString() == body.code.toString()) {
                // 删除验证码
                await this.CodeModel.findByIdAndUpdate(res._id, { isDelete: true });
                return await this.UserModel.findOneAndUpdate({ cellphone: body.cellphone }, { password: body.password });
            } else {
                console.log('验证码不正确111');
                throw new Error("验证码不正确");
            }
        } catch (error) {
            console.error('错误信息:', error);
            throw error;
        }
    }

    async addVipCode(body, headers) {
        try{
            let {count, type} = body;
            let create_uid = headers['uid'];

            if(count && type && create_uid){
                // 批量创建激活码
                let vipCodes = [];
                for(let i = 0; i < count; i++){
                    vipCodes.push({
                        type: type,
                        is_use: 0, // 默认未使用
                        create_uid: create_uid,
                        use_uid: null,
                        use_time: null,
                        isDelete: false
                    });
                }

                // 批量插入数据库
                let result = await this.VipModel.insertMany(vipCodes);
                return {
                    success: true,
                    count: result.length,
                    message: `成功生成${result.length}个激活码`
                };
            }else{
                throw new Error("参数不正确")
            }
        } catch (error) {
            console.error('错误信息:', error);
            throw error;
        }
    }

    async get_vip_codes(body, headers) {
        try {
            let { page = 1, type, is_use, creator } = body;

            // 构建查询条件
            let query = {
                isDelete: false
            };

            if(type){
                query["type"] = type;
            }
            if(is_use !== null && is_use !== undefined){
                query["is_use"] = parseInt(is_use);
            }

            let total = await this.VipModel.count(query);
            let tableData = await this.VipModel.find(query)
                .populate('create_uid', 'userName cellphone')
                .populate('use_uid', 'userName cellphone')
                .skip(page > 0 ? ((page - 1) * 10) : 0)
                .limit(10)
                .sort({'_id': -1});

            // 处理返回数据，添加激活码字段
            let arr = [];
            for(let item of tableData){
                item = item.toObject();
                item["code"] = item._id.toString(); // 使用_id作为激活码
                item["creator"] = item.create_uid ? item.create_uid.userName || item.create_uid.cellphone : '';
                item["user"] = item.use_uid ? item.use_uid.userName || item.use_uid.cellphone : '';
                arr.push(item);
            }

            return {
                total,
                tableData: arr
            };
        } catch (error) {
            console.error('错误信息:', error);
            throw error;
        }
    }

    async delVipCode(body, headers) {
        try {
            let {_id} = body;
            if(!_id){
                throw new Error("参数不正确");
            }

            let result = await this.VipModel.findByIdAndUpdate(_id, {isDelete: true});
            if(result){
                return {
                    success: true,
                    message: "删除成功"
                };
            } else {
                throw new Error("激活码不存在");
            }
        } catch (error) {
            console.error('错误信息:', error);
            throw error;
        }
    }

    // 获取用户激活记录
    async getUserActivateRecords(body, headers) {
        try {
            let { page = 1 } = body;
            let uid = headers['uid'];

            if(!uid){
                throw new Error("用户信息异常，请重新登录");
            }

            // 构建查询条件 - 查询当前用户使用过的激活码
            let query = {
                isDelete: false,
                is_use: 1, // 已使用的激活码
                use_uid: uid // 当前用户使用的
            };

            let total = await this.VipModel.count(query);
            let tableData = await this.VipModel.find(query)
                .populate('create_uid', 'userName cellphone')
                .skip(page > 0 ? ((page - 1) * 10) : 0)
                .limit(10)
                .sort({'use_time': -1}); // 按使用时间倒序

            // 处理返回数据
            let arr = [];
            for(let item of tableData){
                item = item.toObject();
                item["code"] = item._id.toString(); // 使用_id作为激活码
                item["creator"] = item.create_uid ? item.create_uid.userName || item.create_uid.cellphone : '';
                
                // 根据type转换为中文描述
                let typeMap = {
                    '1': '月卡',
                    '2': '季卡', 
                    '3': '年卡'
                };
                item["typeText"] = typeMap[item.type] || '未知类型';
                
                // 计算增加的天数
                let daysMap = {
                    '1': 30,
                    '2': 90,
                    '3': 365
                };
                item["addDays"] = daysMap[item.type] || 0;
                
                arr.push(item);
            }

            return {
                total,
                tableData: arr
            };
        } catch (error) {
            console.error('获取激活记录错误:', error);
            throw error;
        }
    }

    async activateVipCode(body, headers) {
        try {
            let {code} = body;
            let uid = headers['uid'];

            if(!code || !uid){
                throw new Error("请输入激活码");
            }

            // 验证激活码格式
            const mongoose = require('mongoose');
            if(!mongoose.Types.ObjectId.isValid(code)){
                throw new Error("激活码格式不正确，请检查后重新输入");
            }

            // 查找激活码
            let vipCode = await this.VipModel.findOne({
                _id: code,
                isDelete: false,
                is_use: 0
            });

            console.log(vipCode,'vipcode');
            if(!vipCode){
                throw new Error("激活码不存在或已被使用，请检查后重新输入");
            }

            // 获取用户信息
            let user = await this.UserModel.findById(uid);
            if(!user){
                throw new Error("用户信息异常，请重新登录");
            }

            let recordUserInfo = await this.UserModel.findOne({isDelete: false, _id: uid})
            //2 增加用户金额 过期时间
            let expireDate = moment(recordUserInfo.expireDate || new Date())
            if( moment(expireDate).isBefore(  moment(new Date()) ) ){
                expireDate = moment(new Date())
            }
            let daysObj = {
                '1': 30,
                '2' : 90,
                '3': 365
            }
            let priceObj = {
                '1': 398,
                '2': 798,
                '3': 1698
            }
            let custom_days = daysObj[vipCode['type']]
            let money = priceObj[vipCode['type']] || 0
            expireDate = moment(expireDate).add(custom_days, 'days').format("YYYY-MM-DD")
            await this.UserModel.findOneAndUpdate({isDelete: false, _id: uid}, {
                expireDate: expireDate
            })
            console.log('11')
            // 更新激活码状态
            await this.VipModel.findByIdAndUpdate(code, {
                is_use: 1,
                use_uid: uid,
                use_time: new Date()
            });
            // 创建账单记录
            await this.BillModel.create({
                uid: uid,
                prev_money: recordUserInfo.yue || 0,
                add_money: money,
                now_money: recordUserInfo.yue || 0,
                custom_days: custom_days,
                orderNo: 'VIPCODE_' + code,
                recordWay: 3,
                desc: '激活码充值'
            })
            return {
                success: true,
                message: "激活成功，会员时间已延长",
            };
        } catch (error) {
            console.error('激活码激活错误:', error);
            throw error;
        }
    }

    async register(body) {
        try{
            if(body.password){
                body.password = passwordToMd5(body.password)
                }
                // 检测是否已存在
                let count =  await this.UserModel.count({ isDelete: false, cellphone: body.cellphone })
                if(count){
                    throw new Error("用户已存在")
                }
                //检测验证码是否正确
                let res = await this.CodeModel.findOne({
                  isDelete: false,
                  cellphone: body.cellphone,
                }).sort({ _id: -1 })
                console.log(res, '---');
                console.log(res.code.toString());
                console.log(body.code.toString());
                if(res.code.toString() == body.code.toString()){
                    //删除
                    await this.CodeModel.findByIdAndUpdate(res._id, {isDelete: true}, { new: true });
                    return await this.UserModel.create(body)
                }else{
                    throw new Error("验证码不正确")
                }
        } catch (error) {
            console.error('错误信息:', error);
            throw error;
        }


    }
    async getPddScrapy(){
        // return {ifOver: true}
        return {ifOver: false}
    }

    async login(body){
        if(body.password){
            body.password = passwordToMd5(body.password)
        }

        let query = {
            isDelete: false,
            password: body.password,
            cellphone: body.cellphone,
        }
        let data =  await this.UserModel.findOne(query)

        if(data){
            if(body.type != 'web'){
                if(!data.expireDate){
                    throw new Error("请开通会员后使用")
                }else{
                    console.log("data.expireDate",data.expireDate)
                    if( !moment(new Date()).isBefore( moment(data.expireDate).add(1, 'days') ) ){
                        throw new Error("会员已到期，请充值")
                    }
                }
            }
            //生成token 存库并且返回前端
            await this.UserModel.findByIdAndUpdate(data['_id'],{token: Math.random().toString()})
            return await this.UserModel.findOne(query)
        }else{
            throw new Error("用户名或密码错误")
        }
    }

    async get_userinfo(headers: any){
        let uid = headers['uid']
        let token = headers['token']
        let type = headers['type']
        let data =  await this.UserModel.findOne({
            isDelete: false,
            _id: uid
        })
        // console.log(data)
        if(type){
            if(data){
                //检查token
                let tokenData =  await this.UserModel.findOne({
                    isDelete: false,
                    _id: uid,
                    token
                })
                console.log(token)
                if(tokenData){
                    return tokenData
                }else{
                    throw new Error("账号已在别处登录，请联系管理员")
                }
            }else{
                if(!data.expireDate){
                    throw new Error("请开通会员后使用")
                }
                if( !moment(new Date()).isBefore( moment(data.expireDate).add(1, 'days') ) ){
                    throw new Error("会员已到期，请充值")
                }
            }
        }else{
            if(data){
                if(!data.expireDate){
                    throw new Error("请开通会员后使用")
                }else{
                    data = data.toObject()
                    return {
                        userName: data.userName,
                        cellphone: data.cellphone,
                        expireDate: data.expireDate
                    };
                }
            }else{
                return  data
            }
        }


    }
}

