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
<!--            </TabPane>-->
<!--        </Tabs>-->

        <!--本地上传-->
        <Modal
                :width="700"
                v-model=" record_form.status "
                :title="tab_name"
                :mask-closable="false"  class-name="vertical-center-modal">
            <Form ref="record_form" :model="record_form" :rules="record_rule" :label-width="80">
                <div  class="pay_img_box">
<!--                    <img :src="code_url" alt="">-->
                </div>
                <div class="pay_box">
                    <span>
                        支付宝扫一扫付款（元）
<!--                        <span style="color: red;">内侧期间直接点击下方确定即可，无需真实支付</span>-->
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
        name: "User_rechaege",
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

                record_form:{
                    status: false,
                    name: 666
                },
                record_rule:{

                },
                tab_name :'支付宝充值',
                sure_text :'充值完成',
                code_url: '',
                orderNo: null
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
          async getQrcode() {
            let res = await this.Ajax('getQrcode', { money: this.custom_money, custom_days: this.custom_days, type: this.tab_name });
            if (res) {
              // 获取返回的 HTML 表单字符串
              const formHTML = res.data.qrCodeData;

              // 创建一个 iframe 元素
              const iframe = document.createElement("iframe");
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "none";

              // 将 iframe 插入到 pay_img_box div 中
              const payImgBox = document.querySelector(".pay_img_box");
              payImgBox.innerHTML = ""; // 清空之前的内容
              payImgBox.appendChild(iframe);

              // 写入 HTML 表单内容到 iframe 的文档
              const iframeDoc = iframe.contentWindow.document;
              iframeDoc.open();
              iframeDoc.write(formHTML);
              iframeDoc.close();

              // 提取并执行表单中的 `<script>`（如果存在）
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = formHTML;
              const scriptElement = tempDiv.querySelector("script");
              if (scriptElement) {
                iframe.contentWindow.eval(scriptElement.textContent);
              }

              this.record_form.status = true;
              this.orderNo = res["data"]["orderNo"];
            }
          },
          async sure_record(){
                var num = 3;
                clearInterval(timer);
                this.sure_text = "正在检查订单状态--请稍后3秒"
                var timer = setInterval( async ()=>{
                    num --;
                    this.sure_text = "正在检查订单状态--请稍后"+(num)+"秒"
                    if(num <= 1){
                        clearInterval(timer)
                        this.sure_text = "充值完成";
                        let res = await this.Ajax('checkOrderNo',{ orderNo: this.orderNo})
                        if(res){
                            if(res.data.ifGetVxResponse){
                                this.record_form.status = false
                                Message.success("订单支付成功")
                                this.getDate()
                            }else{
                                Message.error("订单状态未成功，请扫码支付后再次检查")
                            }
                        }
                    }
                },1000)

                // this.Ajax.post(API_URL.check_record_result,{
                // }).then( (res)=>{
                //     console.log(res)
                //     if(res["DATA"].trade_state_desc == "订单未支付"){
                //         this.$Message.error(res["DATA"].trade_state_desc+",请扫码支付")
                //     }else{
                //         this.$Message.success(res["DATA"].trade_state_desc);
                //         this.record_form.status = false;
                //         this.$emit('get_data')
                //     }
                // } )
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
