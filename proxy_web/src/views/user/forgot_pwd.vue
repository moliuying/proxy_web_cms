<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">变色龙指纹浏览器平台</div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80" label-position="left">
                <FormItem prop="cellphone" label="手机号">
                    <Input type="number" v-model="formInline.cellphone" placeholder="请输入手机号" >
                    </Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="formInline.password" password placeholder="请输入密码" ></Input>
                </FormItem>
                <FormItem prop="password2" label="确认密码">
                    <Input type="password" v-model="formInline.password2" password placeholder="请确认密码" >
                    </Input>
                </FormItem>
                <FormItem prop="code" label="验证码">
                    <Input type="number" v-model="formInline.code" search :enter-button=" code_text " placeholder="请输入验证码" @on-search=" formInline.cellphone?get_cms_code():$Message.error('手机号不能为空') "/>
                </FormItem>
                <div>
                    <Button type="primary" size="large" long @click="handleSubmit('formInline')">重置密码</Button>
                </div>
                <div class="bottom_box">
                    <span @click="login" style="margin-top: 10px;">
                         <span style="color: #1890ff;">去登录</span>
                    </span>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                code_text:'发送',
                formInline: {
                    cellphone: '',
                    password: '',
                    password2: '',
                    code: '',
                    parent: this.$route.query.parent || '',
                },
                ruleInline: {
                    code: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ],
                    cellphone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '确认密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted(){

        },
        methods: {
            get_cms_code(){
                if(typeof this.code_text != 'number'){
                    this.code_text = 60;
                    this.timer = setInterval( () =>{
                        this.code_text --;
                        if(this.code_text == 0){
                            this.code_text = "重新发送";
                            clearInterval( this.timer )
                        }
                    },1000 )
                    this.Ajax('send_cms_code',{
                        cellphone: this.formInline.cellphone,
                        type: '2'
                    }).then( (res)=> {
                        console.log(res);
                        if(res){
                            this.$Message.success('发送成功!');
                        }
                    })
                }else{
                    this.$Message.error("请在"+this.code_text+"秒后重试")
                }
            },
            async handleSubmit(name) {
                let ifOk = await this.$refs[name].validate()
                if(ifOk){
                    if(this.formInline.password !== this.formInline.password2){
                        this.$Message.error('两次密码请输入一致');
                        return;
                    }
                    console.log("----")
                    let res = await this.Ajax('forgot_pwd',this.formInline)
                    console.log(res)
                    if(res){
                        this.$Message.success('密码成功,请去登录吧!');
                        this.login()
                    }
                }
            },
            login() {
                this.$router.push(
                    {
                        path: "/login",
                        params: {userId: 123}
                    }
                )
            }
        }
    }
</script>

<style scoped>
    .ms-login /deep/  .ivu-form .ivu-form-item-label{
        /*color: #fff;*/
        color: #000;
        font-size: 14px !important;
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

    .bottom_box {
        font-size: 16px;
        /*color: #fff;*/
        color: #000;
        display: flex;
        /*justify-content: flex-end;*/
        justify-content: center;
    }

    .bottom_box span {
        cursor: pointer;
    }


</style>
