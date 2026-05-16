<template>
    <div class="login-wrap">
        <div class="ms-login" >
            <div  class="ms-title">变色龙指纹浏览器平台</div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline"  label-position="top">
                <FormItem prop="cellphone" label="手机号">
                    <Input type="text" v-model="formInline.cellphone" placeholder="请输入手机号" >
                    </Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="formInline.password" placeholder="请输入密码" password    @keyup.enter.native=" handleSubmit('formInline') ">
                    </Input>
                </FormItem>
<!--                <FormItem prop="role" label="角色" style="color: #fff;">-->
<!--                    <RadioGroup v-model="formInline.role">-->
<!--                        <Radio label="student">-->
<!--                            <span>学生</span>-->
<!--                        </Radio>-->
<!--&lt;!&ndash;                        <Radio label="teacher">&ndash;&gt;-->
<!--&lt;!&ndash;                            <span>管理员</span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </Radio>&ndash;&gt;-->
<!--                    </RadioGroup>-->
<!--                </FormItem>-->
                <div class="bottom_box" style="justify-content: flex-end;">
                    <span @click=" $router.push(  {  name: 'forgot_pwd'} )"  style="margin-bottom: 10px;">
                        <span style="color: #1890ff;">忘记密码</span>
                    </span>
                </div>
                <div>
                    <Button type="primary" long @click="handleSubmit('formInline')">登录</Button>
                </div>
                <div class="bottom_box">
<!--                    <span @click=" $router.push(  {  name: 'forgot_pwd'} ) "  style="margin-top: 10px;">-->
<!--                        修改密码-->
<!--                    </span>-->
                    <span @click=" $router.push(  {  name: 'register'} )"  style="margin-top: 10px;">
                        还没有账号? <span style="color: #1890ff;">立即注册</span>
                    </span>
                </div>
            </Form>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "login",
        data () {
            return {
                formInline: {
                    type: 'web',
                    cellphone: '',
                    password: ''
                },
                ruleInline: {
                    cellphone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        watch: {
            '$route' (to, from) {
                this.$router.go(0);
            }
        },
        mounted(){

        },
        methods: {
            async handleSubmit(name) {
                let ifOk = await this.$refs[name].validate()
                if(ifOk){
                    let res = await this.Ajax('login',this.formInline)
                    console.log(res)
                    localStorage.setItem('userName',res.data.userName)
                    localStorage.setItem('uid',res.data._id)
                    localStorage.setItem('token',res.data.token)
                    localStorage.setItem('companyName',res.data.companyName)
                    localStorage.setItem('roleType',res.data.roleType)
                    localStorage.setItem('cellphone',res.data.cellphone)
                    if(res.data.expireDate){
                        this.$store.commit("get_expireDate", res.data.expireDate)
                    }
                    if(res){
                        // this.$router.push({name:'user_rechaege'})
                        this.$router.push({name:'user_vip'})
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .ms-login /deep/  .ivu-form .ivu-form-item-label{
        /*color: #fff;*/
        color: #000;
        font-size: 16px;
    }
    .ivu-btn{
        font-size: 16px;
    }


    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        /*background: rgba(0,0,0,1);*/
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        background-size: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .ms-login{
        width: 420px;
        border-radius: 5px;
        /*background: rgba(255, 255, 255, 0.1);*/
        background: #fff;
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        /*color: #fff;*/
        color: #000;
        border-bottom: 1px solid #ddd;
    }
    .ms-content {
        padding: 30px 30px;
    }

    .bottom_box{
        font-size: 16px;
        /*color: #fff;*/
        color: #000;
        display: flex;
        /*justify-content: flex-end;*/
        justify-content: center;
    }
    .bottom_box span{
        cursor: pointer;
    }
</style>
