import user from './user'
import index from './indexApi'
const API = {
    ...user,
    ...index
}
import axios from 'axios'
import { Message } from 'view-design'
import router from '../../router'
axios.defaults.baseURL = process.env.API_ROOT
axios.defaults.withCredentials = true // 带cookie请求
// 开启拦截
axios.interceptors.response.use(async (res) => {
    if(res.data.code == 200){
        return Promise.resolve(res.data)
    }else if(res.data.code == 401){
        Message.error(res.data.msg || '登录已过期，请重新登录')
        localStorage.removeItem('uid')
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        localStorage.removeItem('companyName')
        localStorage.removeItem('roleType')
        localStorage.removeItem('cellphone')
        router.push({name: 'login'})
        return Promise.reject(res.data)
    }else{
        Message.error(res.data.msg)
        return Promise.reject(res.data)
    }
}, error => {
    console.log(error,'error')
    if(error.response && error.response.status === 401){
        Message.error('登录已过期，请重新登录')
        localStorage.removeItem('uid')
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        localStorage.removeItem('companyName')
        localStorage.removeItem('roleType')
        localStorage.removeItem('cellphone')
        router.push({name: 'login'})
    }else{
        Message.error('请求异常！请检查网络');
    }
    return Promise.reject(error)
})
export function Ajax(url, data, method, headers) {
    return new Promise((resolve, reject) => {
        axios({
            url: API[url](data),
            method: method || 'post',
            headers: {
                'Content-Type': 'application/json',
                'uid': localStorage.getItem('uid'),
                'token': localStorage.getItem('token'),
                // ...headers
            },
            params: method === 'get' ? data : {},
            data: data,
            async: false,
            // responseType: url.toLowerCase().includes('excel') ? 'blob' : '',
        })
            .then(res => {
                resolve(res)
            }).catch((err) => {
            reject(err)
        })
    }).catch((err) => {
        console.log('err---', err)
    })
}

