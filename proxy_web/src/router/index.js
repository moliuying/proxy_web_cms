import Vue from 'vue'
import Router from 'vue-router'

import ViewUI from 'view-design';




Vue.use(Router)
Vue.use(ViewUI);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            name:"index",
            path: '/index',
            component: require('@/views/index.vue').default,
            children: [
                {
                    path: '/',
                    redirect: '/desc'
                },
                {
                    name:"desc",
                    path: '/desc',
                    component: require('@/views/main/SoftDesc.vue').default,
                    meta: {
                        title: '软件介绍描述',
                        keepAlive: true
                    }
                },
                {
                    name:"vip_list",
                    path: '/vip_list',
                    component: require('@/views/user/vip_list.vue').default,
                    meta: {
                        title: '用户列表',
                        keepAlive: true
                    }
                },
                {
                    name:"user_list",
                    path: '/user_list',
                    component: require('@/views/user/user_list.vue').default,
                    meta: {
                        title: '用户列表',
                        keepAlive: true
                    }
                },
                {
                    name:"user_rechaege",
                    path: '/user_rechaege',
                    component: require('@/views/order/user_rechaege.vue').default,
                    meta: {
                        title: '用户支付宝充值',
                        keepAlive: false
                    }
                },
                {
                    name:"user_vip",
                    path: '/user_vip',
                    component: require('@/views/order/user_vip.vue').default,
                    meta: {
                        title: '激活码充值',
                        keepAlive: false
                    }
                },
                // {
                //     name:"user_apply_list",
                //     path: '/user_apply_list',
                //     component: require('@/views/order/user_apply_list.vue').default,
                //     meta: {
                //         title: '用户充值',
                //         keepAlive: false
                //     }
                // },
                // {
                //     name:"user_pay_list",
                //     path: '/user_pay_list',
                //     component: require('@/views/order/user_pay_list.vue').default,
                //     meta: {
                //         title: '分佣列表',
                //         keepAlive: false
                //     }
                // },
                {
                    name:"user_bill",
                    path: '/user_bill',
                    component: require('@/views/order/user_bill.vue').default,
                    meta: {
                        title: '用户账单',
                        keepAlive: false
                    }
                },
                {
                    name:"user_activate_records",
                    path: '/user_activate_records',
                    component: require('@/views/order/user_activate_records.vue').default,
                    meta: {
                        title: '激活记录',
                        keepAlive: false
                    }
                },
                // {
                //     name:"user_getMoney_list",
                //     path: '/user_getMoney_list',
                //     component: require('@/views/user/user_getMoney_list.vue').default,
                //     meta: {
                //         title: '个人中心',
                //         keepAlive: false
                //     }
                // },
                {
                    name:"user_info",
                    path: '/user_info',
                    component: require('@/views/order/user_info.vue').default,
                    meta: {
                        title: '个人中心',
                        keepAlive: false
                    }
                },
            ]
        },
        {
            name: 'login',
            path: '/login',
            component: require('@/views/user/login.vue').default,
            meta: ["登录页"]
        },
        {
            name: 'register',
            path: '/register',
            component: require('@/views/user/register.vue').default,
            meta: ["注册页"]
        },
        {
            name: 'forgot_pwd',
            path: '/forgot_pwd',
            component: require('@/views/user/forgot_pwd.vue').default,
            meta: ["注册页"]
        },
        {
            name: 'test',
            path: '/test',
            component: require('@/views/user/test.vue').default,
            meta: ["测试页"]
        }
    ]
})

const whiteList = ['login', 'register', 'forgot_pwd', 'test']

router.beforeEach((to, from, next) => {
    const uid = localStorage.getItem('uid')
    const token = localStorage.getItem('token')
    
    if (uid && token) {
        if (to.name === 'login') {
            next({name: 'user_vip'})
        } else {
            next()
        }
    } else {
        if (whiteList.includes(to.name)) {
            next()
        } else {
            next({name: 'login'})
        }
    }
})

export default router
