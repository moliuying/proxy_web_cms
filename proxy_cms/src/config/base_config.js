const process = require('process');
const Core = require('@alicloud/pop-core');
// var RPCClient = require('@alicloud/pop-core').RPCClient;

const {desktop_action_log} = require("../models/index")
const {KJUR, hextob64} = require('jsrsasign')
const rsu = require('jsrsasign-util')
const path = require('path');




module.exports = {
    appid:'wx7003df0a877a6db0', //直连商户申请的公众号或移动应用appid
    mchid: "1602976327", //微信支付商户号
    serial_no: "2C85AE5422F6C81D83AA17CDDF49356930CAED60", //商户API证书序列号
    
    vx_base_url:'https://api.mch.weixin.qq.com',
    vx_pay_url:  '/v3/pay/transactions/native', //
    vx_check_result_url:'/v3/pay/transactions/out-trade-no/',
    vx_apiv3_miyao:"2C85AE5422F6C81D83AA17CDDF493569",  //APIV3密钥
    koajwt_secret: process.env.APP_SECRET || "tiangong_koajwt", //token 混淆参数
    user_pwd_secret: "tiangong_user_pwd", //用户表 pwd  混淆参数
    email_address: "@phenom-films.com.onaliyun.com",
    accessKeyId: process.env.ALI_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.ALI_ACCESS_KEY_SECRET || '',
    //阿里云默认节点
    ali_default_regionId: 'cn-beijing',
    get_Authorization(url,body){
        let nonce_str = parseInt(Math.random() * Math.pow(2, 64));  //请求随机串
        let timestamp = parseInt(Date.now() / 1000) //时间戳
        let sig_str = new KJUR.crypto.Signature({
            alg: 'SHA256withRSA',
            prvkeypem: rsu.readFile(  path.resolve('../apiclient_key.pem') )
        });
        let content = url+`\n${timestamp}\n${nonce_str}\n${body?JSON.stringify(body):''}\n`
        sig_str.updateString(content);
        let signature = hextob64(sig_str.sign());
        let Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchid}",nonce_str="${nonce_str}",signature="${signature}",timestamp="${timestamp}",serial_no="${this.serial_no}"`
        return Authorization;
    },
    ali_post_option: {
        method: 'POST',
        timeout: 20000
    },
    //阿里云 get公共参数
    ali_get_option: {
        method: 'GET',
        timeout: 20000
    },
    
    //阿里云实例 基础配置client
    base_client(endpoint, apiVersion, source_obj) {
        source_obj = source_obj || {};
        // console.log(Object.assign({
        //     accessKeyId: source_obj.accessKeyId ?source_obj.accessKeyId : this.accessKeyId,
        //     accessKeySecret: source_obj.accessKeyId ?source_obj.accessKeyId :this.secretAccessKey,
        //     endpoint: `https://${endpoint}.aliyuncs.com`,
        //     apiVersion: apiVersion
        // }, source_obj))
        return new Core(Object.assign({
            accessKeyId: source_obj.accessKeyId ? source_obj.accessKeyId : this.accessKeyId,
            accessKeySecret: source_obj.accessKeyId ? source_obj.accessKeyId : this.secretAccessKey,
            endpoint: `https://${endpoint}.aliyuncs.com`,
            apiVersion: apiVersion
        }, source_obj));
    },
    
    //阿里云 短信基础参数
    sms_template_param: {
        "RegionId": "cn-hangzhou",
        "SignName": "天工云",
        "TemplateCode": "SMS_191767724",
    },
    //阿里云 短信实例
    sms_code_client(action, params) {
        return this.base_client('dysmsapi', '2017-05-25', {
            codes: ["isv.BUSINESS_LIMIT_CONTROL"]
        })
            .request(action, Object.assign(this.sms_template_param, params), this.ali_post_option)
    },
    //阿里云 滑动验证实例
    scroll_auth_client(action, params) {
        return this.base_client('afs', '2018-01-12', {codes: [100, 900]})
            .request(action, params, this.ali_get_option)
    },
    //创建ram子账号  实例  ram账号需要主管理员权限
    ram_client(action, params) {
        return this.base_client('ram', '2015-05-01', {
            codes: ["EntityAlreadyExists.User"]
        })
            .request(action, Object.assign({
                "RegionId": this.ali_default_regionId
            }, params), this.ali_post_option)
    },
    //阿里云桌面实例
    desk_client(action, params, source_obj) {
        source_obj = source_obj || {};
        source_obj["codes"] = ["QuotaExceed.ElasticQuota", "ClusterNotReady"];
        source_obj["codes"] = ["ClusterNotReady"];
        // console.log(Object.assign({
        //     "RegionId": this.ali_default_regionId
        // }, params))
        return this.base_client('gws.cn-beijing', '2019-06-18', source_obj)
            .request(
                action,
                Object.assign({
                    "RegionId": this.ali_default_regionId
                }, params), this.ali_post_option)
    },
    //阿里云  价格计算client
    price_client(action, params) {
        return this.base_client('ecs', '2014-05-26')
            .request(action, Object.assign({"RegionId": this.ali_default_regionId}, params), this.ali_post_option)
    },
    /*
    * 操作日志存储
    * */
    async create_action_log(obj) {
        await desktop_action_log.create(
            obj
        )
    }
}

