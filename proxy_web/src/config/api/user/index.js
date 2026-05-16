export default {
    login: () => '/user/login', // 用户登录
    register: () => '/user/register', // 用户注册
    addOneUser: () => '/user/addOneUser', // 用户注册
    delOneUser: () => '/user/delOneUser', // 用户注册
    get_userinfo: () => '/user/get_userinfo', // 用户注册
    get_users: () => '/user/get_users', // 用户注册
    set_campany: () => '/user/set_campany', // 用户注册
    sureSetExpireDate: () => '/user/sureSetExpireDate',
    changePwd: () => '/user/changePwd',
    send_cms_code: () => '/user/send_cms_code',
    forgot_pwd: () => '/user/forgot_pwd',
    addVipCode: () => '/user/addVipCode',
    get_vip_codes: () => '/user/get_vip_codes',
    delVipCode: () => '/user/delVipCode',
    activateVipCode: () => '/user/activateVipCode',
    getUserActivateRecords: () => '/user/getUserActivateRecords', // 获取用户激活记录
}
