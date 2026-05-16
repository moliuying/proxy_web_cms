<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">玉兔后台管理系统  </div>
            <Form class="ms-content" ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80" label-position="left">
                <FormItem prop="user_name" label="用户名">
                    <Input type="text" v-model="formInline.user_name" placeholder="请输入用户名" ></Input>
                </FormItem>
                <FormItem prop="company_name" label="公司名称">
                    <Input type="text" v-model="formInline.company_name" placeholder="请输入公司名称" >
                    </Input>
                </FormItem>
                <FormItem prop="cellphone" label="手机号">
                    <Input type="number" v-model="formInline.cellphone" placeholder="请输入手机号" >
                    </Input>
                </FormItem>
                <!--<FormItem prop="code">-->
                    <!--<Input type="number" v-model="formInline.code" search :enter-button=" code_text "  placeholder="请输入验证码" @on-search=" formInline.cellphone?check_get_cms_code():$Message.error('手机号不能为空') "/>-->
                <!--</FormItem>-->



                <FormItem prop="address" label="地址">
                    <Input type="text" v-model="formInline.address" placeholder="请输入地址" >
                    </Input>
                </FormItem>
                <div>
                    <Button type="primary" long @click="handleSubmit('formInline')">更新</Button>
                </div>
                <div class="bottom_box">
                    <span @click="login">
                        返回首页
                    </span>
                </div>
                <!--<FormItem>-->
                    <!--<div id="picture_virtual" style="    margin: 0 auto; " v-if=" check_get_cms_code_status ">-->

                    <!--</div>-->
                <!--</FormItem>-->
            </Form>
        </div>

    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                picture_virtual:"",
                check_get_cms_code_status: true,
                code_text:'发送',
                formInline: {
                    id:  JSON.parse(sessionStorage.getItem("userinfo")).id,
                    user_name: JSON.parse(sessionStorage.getItem("userinfo")).user_name,
                    company_name: JSON.parse(sessionStorage.getItem("userinfo")).company_name,
                    cellphone: JSON.parse(sessionStorage.getItem("userinfo")).cellphone,
                    // code:'1234',
                    address: JSON.parse(sessionStorage.getItem("userinfo")).address,
                },
                ruleInline: {
                    user_name: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    company_name: [
                        {required: true, message: '公司名称不能为空', trigger: 'blur'}
                    ],
                    cellphone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    // code: [
                    //     {required: true, message: '验证码不能为空', trigger: 'blur'},
                    //     {type: 'string', min: 4, message: '验证码长度不能少于4位', trigger: 'blur'}
                    // ],
                }
            }
        },
        mounted(){

        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.Ajax.post(API_URL.update_uinfo, this.formInline).then( (res)=> {
                            if(res){
                                this.$Message.success('更新资料成功!');
                                sessionStorage.setItem('userinfo', JSON.stringify(this.formInline));
                            }
                        })
                    } else {
                        this.$Message.error('表单数据有误,请检查');
                    }
                })
            },
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
                        path: "/index"
                    }
                )
            }
        }
    }
</script>

<style scoped>
    .ms-login /deep/  .ivu-form .ivu-form-item-label{
        color: #fff;
    }
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,1);
        background-size: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .ms-login{
        width: 420px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
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
    }
</style>
