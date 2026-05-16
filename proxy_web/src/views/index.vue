<style scoped>
    body{
        margin: 0;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        /*overflow: hidden;*/
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        /*width: 420px;*/
        margin: 0 auto;
        margin-right: 20px;
    }

    .ivu-layout-header {
        /*padding: 0 0 0 50px;*/
        /*padding: 0 50px;*/
        width: 100%;
        /*color: #000 !important;*/
    }

    .layout-logo {
         width: auto;
        height: 30px;
        background: none;
        line-height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
        font-size: 20px;
        color: #000;
    }
    .layout,.ivu-layout{
        height: 100%;
        border: none;
    }
    .ivu-layout{
        min-height: 100%;
        background: #fff;
    }
    .ivu-layout-sider{
        background: #515a6e  !important;
    }


    .layout-con{
        height: 100%;
        width: 100%;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 120px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .menu::after{
        background: none;
    }
</style>
<template>
    <div class="layout" >
        <Layout>
            <Header :style="{
                background: $route.name !== 'desc' ? 'rgb(36, 47, 66)' : '#fff'
            }">
                <Menu mode="horizontal" :theme=" $route.name !== 'desc' ? 'dark' : 'light' " class="menu" :style="{
                    background: $route.name !== 'desc' ? 'rgb(36, 47, 66)' : '#fff',
                     }" style=" font-weight: bold;" @on-select=" header_menu_select ">
                    <div class="layout-logo" :style="{
                color:  $route.name !== 'desc' ? '#fff' : '#000'
                     }" >
                        变色龙指纹浏览器平台
<!--                        <Button type="success" ghost style="margin-left: 44px; margin-right: 14px; cursor: pointer;"-->
<!--                                @click=" open_down_url('https://beijihu.obs.cn-north-4.myhuaweicloud.com/%E5%8C%97%E6%9E%81%E7%8B%90%20Setup%202.0.0.exe') ">window新版软件下载（推荐） <Icon type="logo-windows" />-->
<!--                        </Button>-->
<!--                        <Button type="warning" ghost style="margin-left: 44px; margin-right: 14px; cursor: pointer;"-->
<!--                                @click=" open_down_url('https://beijihu.obs.cn-north-4.myhuaweicloud.com/%E5%8C%97%E6%9E%81%E7%8B%90%20Setup%201.0.0.exe') ">软件下载 <Icon type="logo-windows" />-->
<!--                        </Button>-->
                    </div>

                    <div class="layout-nav" v-if="uid" style="float: right; ">
                        <Submenu name="user"  >
                            <template slot="title">
                                <Icon type="md-person" />
                                欢迎您,{{ userName }} <template v-if="companyName">({{companyName}})</template>
                            </template>
                            <MenuItem name="user_loginout">
                                退出登录
                            </MenuItem>
                        </Submenu>
                    </div>
                    <Button v-if="!uid" ghost style="float: right; margin-top: 14px; margin-right: 20px;" type="success" @click="$router.push(  {  name: 'login'} ) ">登录</Button>
                    <Button v-if="!uid" ghost style="float: right; margin-top: 14px; margin-right: 20px;" type="primary" @click="$router.push(  {  name: 'register'} ) ">注册</Button>
                    <Button v-if="uid  && $route.name != 'user_rechaege'" :ghost=" ['desc','login','register'].includes($route.name)" style="float: right; margin-top: 14px; margin-right: 20px;" type="primary" @click="$router.push(  {  name: 'user_vip'} ) ">订单管理</Button>
                    <Button v-if="$route.name !== 'desc'" style="float: right; margin-top: 14px; margin-right: 20px;" type="primary" @click="$router.push(  {  name: 'desc'} ) ">首页</Button>
<!--                    <div  style="float: right; ">-->
<!--                        <Button type="primary" ghost style="margin-left: 44px; margin-right: 14px;">-->
<!--                            邀请码=>-->
<!--                        </Button>-->
<!--                        <Input inline :value="uid" style="width: 220px;" />-->
<!--                        <Button :type="expireDate?'success':'error'" ghost style="margin-left: 44px; margin-right: 14px;">-->
<!--                            会员到期时间: {{ expireDate ? moment(expireDate).format('YYYY-MM-DD') : '未开通' }}-->
<!--                        </Button>-->
<!--                    </div>-->
                </Menu>
            </Header>
            <template v-if="$route.name == 'desc'">
                <SoftDesc />
            </template>
            <template v-else style="height: 100%;">
                <Layout>
                    <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
                        <!--                    <Menu :active-name="refuse_path" ref="left" theme="dark" width="auto" :class="menuitemClasses" @on-select=" menu_select ">-->
                        <!--                        <MenuItem v-for=" (item,index) in menuitem_lists" :key="index"  :name="item.active_name">-->
                        <!--                            <Icon :type="item.icon"></Icon>-->
                        <!--                            <span>{{ item.text }}</span>-->
                        <!--                        </MenuItem>-->
                        <!--                    </Menu>-->
                        <Menu :open-names="['user']" active-name="user_vip" theme="dark" width="auto"
                              :class="menuitemClasses" @on-select=" left_menu_select ">
                            <Submenu name="user">
                                <template slot="title">
                                    <Icon type="ios-construct"></Icon>
                                    个人中心
                                </template>
                                <MenuItem name="user_vip">激活码充值</MenuItem>
                                <MenuItem name="user_activate_records">  激活记录 </MenuItem>
                                <MenuItem name="user_rechaege"> 支付宝充值 </MenuItem>
                                <MenuItem name="user_bill">  充值记录 </MenuItem>
<!--                                <MenuItem name="user_apply_list">  邀请记录 </MenuItem>-->
<!--                                <MenuItem name="user_pay_list">  分佣列表 </MenuItem>-->
                            </Submenu>
                            <Submenu name="desktop">
                                <template slot="title">
                                    <Icon type="ios-keypad"></Icon>
                                    用户管理
                                </template>
                                <MenuItem name="vip_list" v-if=" (uid === '63184d16b6b9fc06a00bdfae' || uid === '632191bed59dcc0a0f2abf46')"> 激活码列表 </MenuItem>
                                <MenuItem name="user_list" v-if=" (uid === '63184d16b6b9fc06a00bdfae' || uid === '632191bed59dcc0a0f2abf46')"> 用户列表 </MenuItem>
<!--                                <MenuItem name="user_getMoney_list" v-if=" (uid === '63184d16b6b9fc06a00bdfae' || uid === '632191bed59dcc0a0f2abf46')"> 提现申请列表 </MenuItem>-->
                                <MenuItem name="user_info"> 个人中心 </MenuItem>
                            </Submenu>
                        </Menu>
                    </Sider>
                    <Content :style="{padding: '5px',  background: '#fff', padding: '20px', paddingBottom: '300px'}">
                        <keep-alive>
                            <router-view v-if="$route.meta.keepAlive"></router-view>
                        </keep-alive>
                        <router-view v-if="!$route.meta.keepAlive"></router-view>
                    </Content>
                </Layout>
            </template>
        </Layout>
<!--        <a href="改成自己的备案链接" target="_blank" rel="nofollow noopener"><img src="https://www.seoshipin.cn/wp-content/uploads/beian.png">粤公网安备 44098102441079号</a>-->
    </div>
</template>
<script>
    import { mapState,mapActions } from 'vuex'
    import SoftDesc from  './main/SoftDesc'
    export default {
        data () {
            return {
                isCollapsed: false,
                uid: localStorage.getItem('uid'),
                userName:localStorage.getItem('userName'),
                companyName:localStorage.getItem('companyName'),
                roleType:localStorage.getItem('roleType'),
                form_change_pwd:{
                    status: false,
                    old_pwd:"",
                    new_pwd:""
                },
                rule_change_pwd:{
                    old_pwd: [
                        { required: true, message: '原密码不能为空', trigger: 'blur' },
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ],
                    new_pwd: [
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ]
                }
            };
        },
        components:{
            SoftDesc
        },
        watch: {
            '$route'(to,from){
                localStorage.setItem('refuse_path',to.path.substr(1).split('/')[0]);
                this.$store.commit('get_refuse_path');
            }
        },
        computed: {
            ...mapState(["p_name","refuse_path",'expireDate']),
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        mounted(){
            // if(!localStorage.getItem('uid')){
            //     this.$router.push(
            //         {
            //             path:"/login",
            //             params: {  }
            //         }
            //     )
            // }
            // this.getDate()
            console.log('1')
        },
        methods:{
            ...mapActions([
                'test','getDate'
            ]),
            open_down_url(url){
                window.open(url)
            },
            left_menu_select(name) {
                this.$router.push({name})
            },
            change_pwd_ok(ref_name){
                this.$refs[ref_name].validate((valid) => {
                    if (valid) {
                        //    执行创建方法
                        this.Ajax.post(API_URL.change_pwd,this.form_change_pwd).then( (res)=> {
                            if(res){
                                this.$Message.success('修改成功');
                                this.$refs[ref_name].resetFields();
                                this.form_change_pwd.status = false;
                            }
                        })
                    } else {
                        this.$Message.error('表单校验失败,请检查');
                    }
                })
            },
            header_menu_select(name){
                if(name == 'user_loginout'){
                    localStorage.removeItem("userName")
                    localStorage.removeItem("uid")
                    this.$router.push(
                        {
                            path:"/login",
                            params: { userId: 123 }
                        }
                    )
                }else if(name == 'user_info'){
                    this.$router.push(
                        {
                            path:"/user_info",
                            params: { userId: 123 }
                        }
                    )
                }else if(name == 'change_pwd'){
                    this.form_change_pwd.status = true;
                    this.$refs['form_change_pwd'].resetFields();
                }
            },
            menu_select(name){
                console.log(this.$route);
                console.log("name",name);
                console.log("name",name+'List');
                // if(document.getElementsByClassName("blocklyWidgetDiv")[0]){
                //     document.getElementsByClassName("blocklyWidgetDiv")[0].style.display = 'none'
                // }
                // if(this.$route.name =='project_detail'){
                //     this.$Modal.confirm({
                //         title: '温馨提示',
                //         okText: '直接离开',
                //         cancelText: '回去保存',
                //         content: '<p>是否保存当前编辑的项目</p>',
                //         onOk: () => {
                //             // this.$Message.info('Clicked ok');
                //             this.$router.push(
                //                 {
                //                     path:"/" + name,
                //                     params: { userId: 123 }
                //                 }
                //             )
                //         },
                //         onCancel: () => {
                //
                //         }
                //     });
                // }else{
                console.log("name",name)
                    this.$router.push(
                        {
                            name: name+'List',
                            params: {  }
                        }
                    )
                // }

            }
        }
    }
</script>
