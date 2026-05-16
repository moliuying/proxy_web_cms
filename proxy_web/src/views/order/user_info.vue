<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="title">
                基本信息
            </div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" label-position="left">
                <FormItem  label="用户名">
                    <Input type="text" v-model="formInline.userName" placeholder="" readonly ></Input>
                </FormItem>
                <FormItem  label="手机号">
                    <Input type="text" v-model="formInline.cellphone" readonly></Input>
                </FormItem>
<!--                <div>-->
<!--                    <Button type="primary" long @click="handleSubmit('formInline')">保存更改</Button>-->
<!--                </div>-->
            </Form>
        </div>
        <div class="ms-login">
            <div class="title">
                修改密码
            </div>
            <Form class="ms-content" ref="formInlinePwd" :model="formInlinePwd" :rules="ruleInlinePwd" :label-width="100" label-position="left">
                <FormItem  label="当前密码" prop="old_password">
                    <Input type="password" v-model="formInlinePwd.old_password" placeholder="" ></Input>
                </FormItem>
                <FormItem  label="新密码" prop="password1">
                    <Input type="password" v-model="formInlinePwd.password1" ></Input>
                </FormItem>
                <FormItem  label="确认新密码" prop="password2">
                    <Input type="password" v-model="formInlinePwd.password2" ></Input>
                </FormItem>
                <!--                <FormItem prop="yue" label="到期时间" v-if="expireDate">-->
                <!--                    <DatePicker type="date" v-model="expireDate" style="width: 200px" />-->
                <!--                </FormItem>-->
                <div>
                    <Button type="primary" long @click="handleSubmitPwd('formInlinePwd')">修改密码</Button>
                </div>
            </Form>
        </div>
        <div class="ms-login">
            <div class="title">
                会员信息
            </div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100" label-position="left">
                <FormItem prop="yue" label="到期时间">
                    <DatePicker type="date" v-model="formInline.expireDate" style="width: 200px" readonly />
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        name: "login",
        data() {
            return {
                picture_virtual:"",
                check_get_cms_code_status: true,
                code_text:'发送',
                formInlinePwd:{
                    old_password: null,
                    password1: null,
                    password2: null
                },
                ruleInlinePwd: {
                    old_password: [
                        {required: true, message: '当前密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ],
                    password1: [
                        {required: true, message: '新密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '新密码长度不能少于6位', trigger: 'blur'}
                    ],
                    password2: [
                        {required: true, message: '确认新密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '新密码长度不能少于6位', trigger: 'blur'}
                    ]
                },
                formInline1: {
                    userName: '',
                    cellphone: '',
                    yue:''
                },
                formInline: {
                    userName: '',
                    cellphone: '',
                    yue:''
                },
                ruleInline: {
                    email: [
                        {
                            validator: (rule, value, callback) => {
                                var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                                if (reg.test(value)) {
                                    callback();
                                } else {
                                    callback(new Error(this.$lan('userindo_email_check_pattern')));
                                }
                            }, trigger: 'blur'
                        }
                    ],

                }
            }
        },
        mounted(){
            this.get_uinfo();
        },
        computed: {
            ...mapState(['expireDate'])
        },
        methods: {
            async handleSubmitPwd(name){
                let ifOk = await this.$refs[name].validate()
                if(ifOk){
                    if(this.formInlinePwd.password1 !== this.formInlinePwd.password2){
                        this.$Message.error('两次密码请输入一致');
                        return;
                    }
                    console.log("----")
                    let res = await this.Ajax('changePwd',this.formInlinePwd)
                    console.log(res)
                    if(res){
                        this.$Message.success('密码修改成功,请去登录吧!');
                        this.$router.push(
                            {
                                path: "/login",
                                params: {userId: 123}
                            }
                        )
                    }
                }
            },
            async get_uinfo(){
                let res = await this.Ajax('get_userinfo')
                if(res){
                    console.log(res,'res')
                    this.formInline = Object.assign(this.formInline,res.data)
                }
            },
            // handleSubmit(name) {
            //     this.$refs[name].validate((valid) => {
            //         if (valid) {
            //             this.Ajax.post(API_URL.update_uinfo, this.formInline).then( (res)=> {
            //                 if(res){
            //                     this.$Message.success('资料修改成功!');
            //                 }
            //             })
            //
            //         } else {
            //             this.$Message.error('表单数据有误,请检查');
            //         }
            //     })
            // },
            check_get_cms_code(){
                let reg = /^1[34578]\d{9}$/;
                if(! reg.test(this.formInline.cellphone) ){
                    this.$Message.error("请输入正确的手机号码");
                    return;
                }
                this.check_get_cms_code_status = true;
                this.get_cms_code();
            },
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
                    this.Ajax.get(API_URL.send_cms_code,{
                        params: {
                            cellphone: this.formInline.cellphone
                        }
                    }).then( (res)=> {
                        console.log(res);

                    })
                }else{
                    this.$Message.error("请在"+this.code_text+"秒后重试")
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

    .login-wrap {
        position: relative;
        width: 100%;
        /*height: 100%;*/
        background-size: 100%;
        display: flex;
        /*flex-direction: column;*/
        justify-content: space-around;
        gap: 20px;
        /*align-items: center;*/
    }
    .ms-login{
        /*width: 620px;*/
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #ccc;
    }
    .title{
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 20px 20px 0 20px;
    }
    .title::before{
        content: '';
        width: 24px;
        height: 24px;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.8;
        display: inline-block;
    }
    .ms-login:nth-child(1) .title::before{
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E");
    }
    .ms-login:nth-child(2) .title::before{
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E");
    }
    .ms-login:nth-child(3) .title::before{
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E");
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .bottom_box {
        font-size: 18px;
        color: #fff;
        display: flex;
        justify-content: flex-end;
    }

    .bottom_box span {
        cursor: pointer;
        float: right;
    }



    /*.ms-login /deep/  .nc_scale div.nc_bg {*/
    /*    background: #2d8cf0 !important; !* 滑过时的背景色 *!*/
    /*    color: #fff;*/
    /*}*/
    /*#nc_1__bg{*/
    /*    background: red !important;*/
    /*}*/
</style>
