// const process = require('process');
// const Core = require('@alicloud/pop-core');
// var RPCClient = require('@alicloud/pop-core').RPCClient;

// const {desktop_action_log} = require("../models/index")
const {KJUR, hextob64} = require('jsrsasign')
const rsu = require('jsrsasign-util')
const path = require('path');




export default {
    GenerateRandomDigit:function (num) {
        let str = "";
        for (let i = 0; i < num; i++) {
            str += Math.floor(Math.random() * 10).toString();
        }
        return str;
    },
    appid:'wx7c49f81c79b1e5c0', //申请的公众号appid  mp.weixin.qq.com  基本配置
    mchid: "1630125691", //微信支付商户号  漯河畅伦网络科技有限公司  pay.weixin.qq.com 产品中心  开发配置
    serial_no: "6A04BD694F46C3873FC4ABBFD172A9E832B3982A", //商户API证书序列号  登录商户平台 pay.weixin.qq.com https://pay.weixin.qq.com/index.php/core/cert/api_cert#
    vx_apiv3_miyao:"2C85AE5422F6C81D83AA17CDDF493569",  //APIV3密钥  https://pay.weixin.qq.com/index.php/core/cert/api_cert#/
    vx_base_url:'https://api.mch.weixin.qq.com',
    vx_pay_url:  '/v3/pay/transactions/native',
    get_Authorization(url,body){
        let nonce_str = parseInt(String(Math.random() * Math.pow(2, 64)));  //请求随机串
        let timestamp = parseInt(String(Date.now() / 1000)) //时间戳
        let sig_str = new KJUR.crypto.Signature({
            alg: 'SHA256withRSA',
            prvkeypem: rsu.readFile(  path.resolve('./apiclient_key.pem') )
        });
        let content = url+`\n${timestamp}\n${nonce_str}\n${body?JSON.stringify(body):''}\n`
        sig_str.updateString(content);
        let signature = hextob64(sig_str.sign());
        let Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchid}",nonce_str="${nonce_str}",signature="${signature}",timestamp="${timestamp}",serial_no="${this.serial_no}"`
        return Authorization;
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

}

