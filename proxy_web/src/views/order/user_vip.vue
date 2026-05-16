<template>
    <div>
        <div class="titleTop" style="height: 80px;   background: linear-gradient(to right, #a3c9fa, #fff);
    display: flex;
    padding: 10px;
    justify-content: space-around;
    flex-direction: column;     color: #333;
    font-weight: bold;">
            <span style="font-size: large;">
                当前会员
            </span>
            <span>
                到期时间: {{moment(expireDate).format("YYYY-MM-DD")}}
            </span>
        </div>
        <div style="height: 100px; line-height: 100px; text-align: center; color: #000; font-size: larger; font-weight: bold;">
            套餐介绍
        </div>
        <div class="box" style="display: flex; gap: 15px;">

            <div class="child" :class="{'active': choose_index == 0}" @click="  choose_index = 0; custom_money = items[0].money ; custom_days = items[0].days   ">
                <div class="top">
                    <span class="price" >{{items[0].money}}</span>
                    <span>/年</span>
                </div>
                <div class="line">

                </div>
                <div class="bottom">
                    <p><Icon type="md-checkmark" />无限制浏览器指纹</p>
                    <p><Icon type="md-checkmark" />企业专属代理</p>
                    <p><Icon type="md-checkmark" />7*24小时技术支持</p>
                    <p><Icon type="md-checkmark" />优先更新</p>
                    <p><Icon type="md-checkmark" />企业指纹管理</p>
                    <p><Icon type="md-checkmark" />API接口支持</p>
                    <p><Icon type="md-checkmark" />专属客服服务</p>
                </div>
                <span class="tuijian">
                    推荐
                </span>
            </div>
            <div class="child" :class="{'active': choose_index == 1}" @click="  choose_index = 1; custom_money = items[1].money ; custom_days = items[1].days   ">
                <div class="top">
                    <span class="price" >{{items[1].money}}</span>
                    <span>/季度</span>
                </div>
                <div class="line">

                </div>
                <div class="bottom">
                    <p><Icon type="md-checkmark" />无限制浏览器指纹</p>
                    <p><Icon type="md-checkmark" />企业专属代理</p>
                    <p><Icon type="md-checkmark" />7*24小时技术支持</p>
                    <p><Icon type="md-checkmark" />优先更新</p>
                    <p><Icon type="md-checkmark" />企业指纹管理</p>
                    <p><Icon type="md-checkmark" />API接口支持</p>
                    <p><Icon type="md-checkmark" />专属客服服务</p>
                </div>
            </div>
            <div class="child" :class="{'active': choose_index == 2}" @click="  choose_index = 2; custom_money = items[2].money ; custom_days = items[2].days   ">
                <div class="top">
                    <span class="price" >{{items[2].money}}</span>
                    <span>/月</span>
                </div>
                <div class="line">

                </div>
                <div class="bottom">
                    <p><Icon type="md-checkmark" />无限制浏览器指纹</p>
                    <p><Icon type="md-checkmark" />高限代理支持</p>
                    <p><Icon type="md-checkmark" />在线技术支持</p>
                    <p><Icon type="md-checkmark" />实时更新</p>
                    <p><Icon type="md-checkmark" />高服指纹管理</p>
                    <p><Icon type="md-checkmark" />指纹导入导出</p>
                </div>

            </div>

        </div>
<!--        <Tabs size="small" type="card" v-model="tab_name">-->
<!--            <TabPane label="支付宝充值" name="支付宝充值" icon="logo-windows">-->
<!--                <Row>-->
<!--                    <Col span="8" v-for=" (item,index) in items" :key="index">-->
<!--                        <div v-if="index == 0" class="custom_money" :class=" {  choose: index == choose_index    } "  @click="  choose_index = index; custom_money = item.money ; custom_days = item.days   ">-->
<!--                            <span style="line-height: 70px; height: 70px;">-->
<!--                                {{ item.money }} 元/ {{item.desc}} <span style="font-size: 18px;">(五折限时优惠)</span>-->
<!--                            </span> <br>-->
<!--                        </div>-->
<!--                        <div v-else-if="index == 1" class="custom_money" :class=" {  choose: index == choose_index    } "  @click="  choose_index = index; custom_money = item.money ; custom_days = item.days   ">-->
<!--                            <span style="line-height: 70px; height: 70px;">-->
<!--                                {{ item.money }} 元/ {{item.desc}} <span style="font-size: 18px;">(六折限时优惠)</span>-->
<!--                            </span> <br>-->
<!--                        </div>-->
<!--                        <div v-else  class="custom_money"-->
<!--                              :class=" {  choose: index == choose_index    } "-->
<!--                              @click="  choose_index = index; custom_money = item.money ; custom_days = item.days   ">-->
<!--                            {{ item.money }} 元/ {{item.desc}}-->
<!--                        </div>-->
<!--                    </Col>-->
<!--                </Row>-->
                <!-- 支付宝充值功能已注释
                <Poptip

                        :transfer="true"
                        confirm
                        :title="  custom_money  | custom_money_title "
                        @on-ok=" getQrcode() "
                        @on-cancel="     "
                        ok-text="确定"
                        cancel-text="取消"   style="float:right; margin-top: 20px;">
                        <Button type="primary" class="record_btn" >
                            支付宝充值
                        </Button>
                </Poptip>
                -->

                <!-- 激活码激活功能 -->
                <Button type="primary" class="record_btn" @click="showActivateModal = true" style="float:right; margin-top: 20px;">
                    激活码充值
                </Button>
<!--            </TabPane>-->
<!--        </Tabs>-->

        <!-- 支付宝充值Modal已注释
        <Modal
                v-model=" record_form.status "
                :title="tab_name"
                :mask-closable="false"  class-name="vertical-center-modal">
            <Form ref="record_form" :model="record_form" :rules="record_rule" :label-width="80">
                <div  class="pay_img_box">
                    <img :src="code_url" alt="">
                </div>
                <div class="pay_box">
                    <span>
                        支付宝扫一扫付款（元）
                    </span>
                    <span>
                        {{ custom_money }}
                    </span>
                </div>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click=" record_form.status = false; $refs['record_form'].resetFields() ">取消</Button>
                <Button type="primary" size="large" @click=" sure_record "> {{ sure_text }}</Button>
            </div>
        </Modal>
        -->

        <!-- 激活码激活Modal -->
        <Modal
                v-model="showActivateModal"
                title="激活码激活"
                :mask-closable="false"
                class-name="vertical-center-modal">
            <Form ref="activateForm" :model="activateForm" :rules="activateRules" :label-width="80">
                <FormItem label="激活码" prop="code">
                    <Input v-model="activateForm.code" placeholder="请输入激活码" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="closeActivateModal">取消</Button>
                <Button type="primary" size="large" @click="activateVipCode" :loading="activateLoading">激活</Button>
            </div>
        </Modal>

        <div class="chatBox" @click="addChat = true;">
            <!--            <span class="text">在线支付宝客服</span>-->
            <div class="chatInnerBox">
            </div>
        </div>
        <Modal
                v-model="addChat"
                title="扫描添加企业客服支付宝"
                ok-text="确定"
                cancel-text="取消"
                @on-ok="addChat = false"
                @on-cancel="addChat = false"
        >
            <p style="display: flex; align-items: center; justify-content: center;">
                <img style="width: 260px;" src="../../img/wechat.jpg" alt="">
            </p>
        </Modal>
    </div>
</template>

<script>
    import { Message } from 'view-design'
    import { mapActions, mapState } from 'vuex'
    export default {
        name: "User_vip",
        data(){
            return {
                expireDate: null,
                addChat: false,
                items:[
                    // 10000,
                    // 5000,
                    // 2000,
                    // 1000,
                    {
                        // money: 2199,
                        money: 1698,
                        days:  365,
                        desc: '1年'
                    },
                    {
                        // money:  1298,
                        // money:  896,
                        money:  798,
                        days:  90,
                        desc: '1季度'
                    },
                    {
                        // money:  498,
                        money:  398,
                        // money:  0.01,
                        days:  30,
                        desc: '1月'
                    }
                ],
                choose_index: 0,
                // custom_money: 100,
                // custom_money: 2199,
                custom_money: 1698,
                custom_days: 365,

                // 支付宝充值相关数据已注释
                // record_form:{
                //     status: false,
                //     name: 666
                // },
                // record_rule:{
                // },
                // tab_name :'支付宝充值',
                // sure_text :'充值完成',
                // code_url: '',
                // orderNo: null

                // 激活码激活相关数据
                showActivateModal: false,
                activateLoading: false,
                activateForm: {
                    code: ''
                },
                activateRules: {
                    code: [
                        { required: true, message: '请输入激活码', trigger: 'blur' },
                        { min: 1, message: '激活码不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        filters:{
            custom_money_title(val){
                return    "是否确认充值"+val+"元?";
            }
        },
        mounted() {
            this.get_uinfo();
        },
        methods:{
            async get_uinfo(){
                let res = await this.Ajax('get_userinfo')
                if(res){
                    this.expireDate = res.data.expireDate
                }
            },
            ...mapActions(['getDate']),
            // 支付宝充值相关方法已注释
            // async getQrcode(){
            //     let res = await this.Ajax('getQrcode',{ money: this.custom_money, custom_days: this.custom_days,  type: this.tab_name})
            //     if(res){
            //         this.record_form.status = true
            //         console.log("res",res)
            //         let bytes = new Uint8Array(res["data"]["qrCodeData"]["data"])
            //         this.orderNo = res["data"]["orderNo"]
            //         let data = "";
            //         let len = bytes.byteLength;
            //         for (let i = 0; i < len; i++) {
            //             data += String.fromCharCode(bytes[i])
            //         }
            //         this.code_url = "data:image/png;base64," + window.btoa(data)
            //     }
            // },
            // async sure_record(){
            //     var num = 3;
            //     clearInterval(timer);
            //     this.sure_text = "正在检查订单状态--请稍后3秒"
            //     var timer = setInterval( async ()=>{
            //         num --;
            //         this.sure_text = "正在检查订单状态--请稍后"+(num)+"秒"
            //         if(num <= 1){
            //             clearInterval(timer)
            //             this.sure_text = "充值完成";
            //             let res = await this.Ajax('checkOrderNo',{ orderNo: this.orderNo})
            //             if(res){
            //                 if(res.data.ifGetVxResponse){
            //                     this.record_form.status = false
            //                     Message.success("订单支付成功")
            //                     this.getDate()
            //                 }else{
            //                     Message.error("订单状态未成功，请扫码支付后再次检查")
            //                 }
            //             }
            //         }
            //     },1000)
            // },

            // 激活码激活相关方法
            closeActivateModal() {
                this.showActivateModal = false;
                this.activateForm.code = '';
                this.$refs['activateForm'].resetFields();
            },
            async activateVipCode() {
                this.$refs['activateForm'].validate(async (valid) => {
                    if (valid) {
                        this.activateLoading = true;
                        let res = await this.Ajax('activateVipCode', { code: this.activateForm.code });
                        if (res) {
                            Message.success(res.data.message || '激活成功');
                            this.closeActivateModal();
                            this.get_uinfo(); // 刷新用户信息
                        } else {
                            Message.error(res.data.msg || '激活失败');
                        }
                        this.activateLoading = false;

                    }
                });
            }
        }
    }
</script>

<style scoped>
    .box .child{
        height: 380px;
        flex: 1;
        border: 1px solid #e0e0e0;
        box-shadow: 0 0 8px 5px rgba(163, 201, 250, 0.5);
        border-radius: 12px;
        padding: 0 15px;
        position: relative;
        cursor: pointer;
    }
    .child.active{
        background: linear-gradient(to left, #a3c9fa, #fff);
    }
    .child .tuijian{
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 6px;
        color: #fff;
        display: block;
        background: #2d8cf0;
        position: absolute;
        right: 8px;
        top: -15px;
    }
    .box .line{
        height: 1px;
        background: #e0e0e0;
        margin: 20px 0;

    }
    .box .top{
        margin-top: 10px;
    }
    .bottom p{
        height: 35px;
        display: flex;
        align-items: center;
    }
    .bottom i{
        color: #2d8cf0;
    }
    .box .price{
        font-size: 40px;
        color: #2d8cf0;
        font-weight: bold;
    }
    .custom_money{
        border: 1px solid #ccc;
        height: 100px;
        border-radius: 5px;
        text-align: center;
        line-height: 100px;
        font-size: 28px;
        color: #808695;
        margin: 10px;
        cursor: pointer;
    }
    .choose{
        background: #2d8cf0;
        color: #fff;
    }

    .record_btn{
         width: 200px; height: 40px;
    }
    .pay_img_box{
        text-align: center;
    }
    .pay_box{
        display: flex;
        flex-direction: column;
        align-items: center;display: flex;
        flex-direction: column;
        align-items: center;
    }
    .pay_box span:nth-child(2){
        color: #ff9900;
        font-size: 24px;
    }
    .chatBox{
        animation: bounce 1s infinite;
        width: 62px;
        height: 62px;
        background: rgb(0, 122, 255);
        cursor: pointer;
        position: fixed;
        bottom: 20px;
        right: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .chatBox span{
        position: absolute;
        color: crimson;
        height: 32px;
        line-height: 32px;
        top: -30px;
        width: 120px;
        text-align: center;
        font-size: 18px;
        left: -36px;
    }
    .chatInnerBox{
        height: 32px;
        width: 32px;
        background: url(https://static.meiqia.com/fe-widget/v1.4.157.prod.20240806_113/static/icon-mq-round@2x.png) 0px 0px / 64px no-repeat;
    }
</style>
