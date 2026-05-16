<template>
    <div>
        <div class="topTitle">
            <p style="padding-top: 0px; margin-top: 0;">
                变色龙指纹浏览器
            </p>
            <p>
                专业管理海外<span class="safe">账号的安全</span>
            </p>
            <ul style="color: #333;
    display: flex;
    justify-content: center;
    gap: 50px;
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 20px;">
                <li>
                    安全的指纹模拟
                </li>
                <li>
                    完美的反爬方案
                </li>
                <li>
                    多账户同时管理
                </li>
            </ul>

            <div class="downBox">
                <span style="width: 192px; height: 58px; font-size: 20px; background: #1E4DFF;  border-radius: 28px;
color: #fff; margin-right: 20px; font-weight: bold;" @click="$router.push(  {  name: 'register'} )">
                    免费注册
                </span>
<!--                <span style="width: 192px; height: 58px; font-size: 20px; background: #fff;-->
<!--                color: #1E4DFF; border: 1px solid #1E4DFF; border-radius: 28px;-->
<!--margin-right: 10px; font-weight: bold;" @click=" open_down_url('https://beijihu.obs.cn-north-4.myhuaweicloud.com:443/%E5%8F%98%E8%89%B2%E9%BE%99%20Setup%201.0.0.exe?AccessKeyId=QR5ISGWXGHQWAW4GQ9H6&Expires=1781780499&Signature=f%2B6Vnhg1SW8ueKHXjr9GFp8h3u4%3D') ">-->
                <span style="width: 192px; height: 58px; font-size: 20px; background: #fff;
                color: #1E4DFF; border: 1px solid #1E4DFF; border-radius: 28px;
margin-right: 10px; font-weight: bold;" @click=" open_down_url('https://beijihu.obs.cn-north-4.myhuaweicloud.com:443/%E5%8F%98%E8%89%B2%E9%BE%99%20Setup%201.0.0.exe?AccessKeyId=QR5ISGWXGHQWAW4GQ9H6&Expires=1785915112&Signature=0kpO3zEPVC/2s0Pnl8XTijNRDEs%3D') ">
                    立即下载<Icon type="logo-windows" style="margin-left: 10px;" />
                </span>
            </div>
        </div>
<!--        <div class="topBgBox">-->
<!--            <div class="topBg">-->
<!--                <div class="textBox">-->
<!--&lt;!&ndash;                    <div>变色龙浏览器</div>&ndash;&gt;-->
<!--                    <div>用虚拟浏览器配置文件</div>-->
<!--                    <div style="font-size: 20px;margin: 15px 0;">-->
<!--                        <img src="../../img/ok.png" alt="" > 代替若干电脑实现防关联多登账户-->
<!--                    </div>-->
<!--                    <div style="font-size: 20px;margin: 15px 0;">-->
<!--                        <img src="../../img/ok.png" alt="" > 模拟硬件浏览器指纹-->
<!--                    </div>-->
<!--                    <div style="font-size: 20px;margin: 15px 0;">-->
<!--                        <img src="../../img/ok.png" alt="" > 多账户防关联多登录账户-->
<!--                    </div>-->
<!--                    <div style="font-size: 20px;margin: 15px 0;">-->
<!--                        <img src="../../img/ok.png" alt="" >  展开团队多人协作-->
<!--                    </div>-->
<!--                    <div style="font-size: 20px;margin: 15px 0;">-->
<!--                        <img src="../../img/ok.png" alt="" > 支持自配代理，支持IPv6-->
<!--                    </div>-->
<!--                    <div style="font-size: 20px;margin: 15px 0;">-->
<!--                        <img src="../../img/ok.png" alt="" > selenium浏览器自动化-->
<!--                    </div>-->
<!--                    <div style="display: flex;">-->
<!--&lt;!&ndash;                        <Button class="register" v-if="!uid" @click="$router.push(  {  name: 'register'} ) ">立即注册</Button>&ndash;&gt;-->
<!--&lt;!&ndash;                        <Button class="download">立即下载</Button>&ndash;&gt;-->
<!--                    </div>-->
<!--                </div>-->
<!--                <img src="../../img/bgR.png" alt="">-->
<!--            </div>-->
<!--        </div>-->
        <div style="margin: auto; max-width: 1100px;">
            <div class="desc1">
                什么是指纹浏览器
            </div>
            <div class="desc2">
                变色龙指纹浏览器，主要实现：多开浏览器窗口、多登账号，防止窗口间产生关联、防止封号，每个窗口可以模拟独立的电脑信息，模拟不同的IP地址，使得相互间完全环境独立、隔离，避免关联封号！
            </div>
            <div class="desc2">
                变色龙指纹浏览器，采用谷歌、火狐内核深度开发，可以实现物理层面的模拟真机信息的效果，代理IP深度匿名化，浏览器窗口之间100%无任何关联性，可推荐纯净干净代理IP，高度保证浏览器环境的干净性！无论您是运营社媒账号、平台账号，还是运营其他的电商店铺、网站账号，都可以为您的账号安全保驾护航！
            </div>
        </div>
        <div style="margin: auto; max-width: 1100px;">
            <div class="desc1">
                变色龙浏览器核心功能
            </div>
            <ul class="descflex">
                <li class="listLi" >
                    <img src="../../img/desc1.png" />
                    <div>
                        <h4 data-v-bb27dcf6="">多开独立浏览器硬件环境</h4>
                        <p data-v-bb27dcf6="">
                            在变色龙中，通过创建独立的浏览器配置文件，实现了高度隔离的虚拟浏览器环境。每个配置文件拥有独立的cookie、本地存储和缓存文件，彻底隔离不同用户或任务之间的数据，有效保护用户隐私并提升安全性。这种设计不仅确保了信息的完整性和保密性，还优化了系统的稳定性和性能表现。
                        </p>
                    </div>
                </li>
                <li class="listLi" >
                    <img src="../../img/desc2.png" />
                    <div>
                        <h4 data-v-bb27dcf6="">浏览器指纹隔离保护</h4>
                        <p data-v-bb27dcf6="">
                            变色龙利用先进技术，通过完全模拟计算机软硬件信息，实现了对浏览器指纹的原生处理。传统的限制网站读取硬件指纹的方法被其彻底颠覆，用户可以享受到与真实硬件指纹不同的信息访问权限。这一革新性的技术不仅提升了数据隐私保护，还为用户提供了更高的安全性和个性化的网络体验。
                        </p>
                    </div>
                </li>
                <li class="listLi" >
                    <img src="../../img/desc3.png" />
                    <div>
                        <h4 data-v-bb27dcf6="">便捷的多账号批量管理</h4>
                        <p data-v-bb27dcf6="">
                            变色龙是一款指纹浏览器工具，可创建多个独立虚拟浏览器，每个模拟独立硬件设备，实现物理隔离，保护隐私和数据安全。每个浏览器可自配独立IP，用户能在全球范围内管理多个网站账号，无需担心IP冲突。变色龙适用于市场营销、数据采集和多账号管理，提供高效、安全的解决方案。
                        </p>
                    </div>
                </li>
                <li class="listLi" >
                    <img src="../../img/desc4.png" />
                    <div>
                        <h4 data-v-bb27dcf6="">支持主流代理IP，支持IPv6</h4>
                        <p data-v-bb27dcf6="">
                            变色龙是为多账号矩阵运营设计的工具，兼容主流代理服务商，提供海外加速服务，助力中国跨境电商全球化布局。支持IPv4和IPv6的HTTP、HTTPS、Socks4和Socks5代理，确保高效、安全的全球连接。无论是电商、广告还是社交媒体管理，变色龙都能提供稳定、高速的网络环境。
                        </p>
                    </div>
                </li>
                <li class="listLi" >
                    <img src="../../img/desc5.png" />
                    <div>
                        <h4 data-v-bb27dcf6="">批量采集货源信息</h4>
                        <p data-v-bb27dcf6="">
                            一键自动化采集第三方平台的货源信息，为商品上架提供最大的便利
                        </p>
                    </div>
                </li>
                <li class="listLi" >
                    <img src="../../img/desc6.png" />
                    <div>
                        <h4 data-v-bb27dcf6="">商品自动上架</h4>
                        <p data-v-bb27dcf6="">
                            多窗口模拟手动按键自动上货，让生意变的如此简单
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <div style="height: 100px;
    line-height: 100px;
    text-align: center;
    margin-top: 30px; font-size: 16px;">
            <a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2022020933号-2</a>
        </div>
        <div class="chatBox" @click="addChat = true;">
<!--            <span class="text">在线支付宝客服</span>-->
            <div class="chatInnerBox">
            </div>
        </div>
<!--        <div style="margin: auto; max-width: 1100px;">-->
<!--            <div class="desc1">-->
<!--                变色龙浏览器能做什么？-->
<!--            </div>-->
<!--            <ul class="descflex" data-v-bb27dcf6="">-->
<!--                <li class="candoli" data-v-bb27dcf6="">-->
<!--                    <img src="../../img/desc2.png" />-->
<!--                    <h4 data-v-bb27dcf6="">批量采集货源信息</h4>-->
<!--                    <p data-v-bb27dcf6="">-->
<!--                        一键自动化采集第三方平台的货源信息，为商品上架提供最大的便利-->
<!--                    </p>-->
<!--                </li>-->
<!--                <li class="candoli" data-v-bb27dcf6="">-->
<!--                    <img src="../../img/desc5.png" />-->
<!--                    <h4 data-v-bb27dcf6="">商品自动上架</h4>-->
<!--                    <p data-v-bb27dcf6="">-->
<!--                        多窗口模拟手动按键自动上货，让生意变的如此简单-->
<!--                    </p>-->
<!--                </li>-->
<!--            </ul>-->
<!--        </div>-->
        <Modal
                v-model="addChat"
                title="扫描添加企业客服支付宝"
                ok-text="确定"
                cancel-text="取消"
                @on-ok="addChat = false"
                @on-cancel="addChat = false"
        >
            <p style="display: flex; align-items: center; justify-content: center;">
                <img style="width: 260px;" src="../../img/newWechat.jpg" alt="">
            </p>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'desc',
        data(){
            return {
                addChat: false,
                uid: localStorage.getItem('uid'),
            }
        },
        methods:{
            open_down_url(url){
                window.open(url)
            }
        }
    }
</script>

<style scoped>
    .topTitle{
        background: rgba(187, 36, 240, 0.1);
        padding-top: 40px;
        padding-bottom: 50px;
        .safe{
            background: linear-gradient(to right,#1e4dff, #d868ff);
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
    .downBox{
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    .downBox span{
        display: block;
        text-align: center;
        line-height: 58px;
    }
    .topTitle p{
        font-size: 40px;
        font-weight: 800;
        color: #000;
        text-align: center;
        margin: 10px 0;
    }
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
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
    .descflex{
        display: flex;
        flex-wrap: wrap;
    }
    .descflex .listLi{
        width: calc(50% - 40px);
    }
    .descflex li{
        margin: 10px 1.6666666667%;
        text-align: center;
        width: 30%;
    }
    .descflex li img{
        height: 150px;
    }
    .descflex li h4{
        -webkit-text-fill-color: transparent;
        background: linear-gradient(90deg, #8a3aff, #165fff);
        background-clip: text;
        -webkit-background-clip: text;
        color: #165fff;
        font-size: 20px;
        height: 72px;
        margin: 20px 0 10px;
    }
    .descflex li p{
        color: #747474;
        font-size: 14px;
        text-align: left;
    }
    .desc1 {
        -webkit-text-fill-color: transparent;
        background: linear-gradient(90deg, #8a3aff, #165fff);
        background-clip: text;
        -webkit-background-clip: text;
        color: #165fff;
        font-size: 30px;
        padding: 50px 0 30px;
        text-align: center;
        font-weight: 400;
    }

    .desc2 {
        color: #4c4c4c;
        font-size: 16px;
        font-weight: 400;
        line-height: 30px;
        margin-top: 20px;
    }

    .register, .download {
        background: #165fff;
        border-radius: 24px;
        color: #fff;
        cursor: pointer;
        display: block;
        height: 45px;
        line-height: 45px;
        margin-top: 25px;
        min-width: 136px;
        padding: 0 10px;
        text-align: center;
        border: none;
    }

    .download {
        background-color: #d833fa;
        color: #fff;
        margin-left: 20px;
    }

    .topBgBox {
        background: url("../../img/bg.png") no-repeat;
        background-size: 100% 100%;
        height: 530px;
        position: relative;
        width: 100%;
    }

    .topBg {
        margin: auto;
        max-width: 1100px;
        display: flex;
        justify-content: space-between;
        padding-top: 70px;
    }

    .topBg img {
        width: 570px;
        height: 420px;
    }

    .textBox {
        color: #fff;
        font-size: 40px;
        font-weight: bold;
        line-height: 1.75;
    }
    .textBox img{
        display: inline-block; width: auto; height: 30px;
        margin-right: 5px;
    }

</style>
