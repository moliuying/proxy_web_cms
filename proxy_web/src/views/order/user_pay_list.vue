<template>
    <div >
        <div style="margin-bottom: 5px; height: 80px;" v-if="cellphone">
            <Form ref="form_search" inline :label-width="90" label-position="left" style="overflow: hidden; padding-left: 10px;">
<!--                <FormItem label="手机号" prop="cellphone">-->
<!--                    <Input type="text" v-model="form_search.cellphone" clearable placeholder="请输入手机号" style="width: 200px;"></Input>-->
<!--                </FormItem>-->
                <FormItem>
                    <Button type="info" @click=" get_data ">搜索</Button>
                </FormItem>
<!--                <FormItem style="float: right;">-->
<!--                    <Button type="primary" @click=" setUser = true ">添加用户</Button>-->
<!--                :title=" `是否确认往支付宝账号 ${ cellphone } 申请提取分佣` "-->
<!--                </FormItem>-->
                <FormItem style="float: right;">
                    <Poptip
                            :transfer="true"
                            confirm
                            :title=" `是否确认提现` "
                            @on-ok=" sureApply() "
                            @on-cancel="     "
                            ok-text="确定"
                            cancel-text="取消"   style="float:right;">
                        <Button type="primary" class="record_btn" >
                            申请提现
                        </Button>
                    </Poptip>
                </FormItem>
            </Form>
<!--            <Button type="primary" class="record_btn"  @click="addOneRecod">-->
<!--                添加充值记录-->
<!--            </Button>-->
        </div>
        <div style="overflow: hidden;">
            <div style="height: 40px; line-height: 40px;">
                下级充值待分润总金额：{{ tableData.reduce((prev,current)=>{
                    if(current.share_type === 1){
                        return prev+current.record_money
                    }else{
                        return prev
                    }
                },0) }} 元
            </div>
            <Table size="small" border stripe :loading="loading" :columns="tableHead" :data="tableData">

                <template slot-scope="{row, index}" slot="share_type">
                    <span v-if="row.share_type === 1">
                        待分佣
                    </span>
                    <span v-else-if="row.share_type === 2">
                        已发起申请
                    </span>
                    <span v-else-if="row.share_type === 3">
                        提现成功
                    </span>
                </template>
                <template slot-scope="{row, index}" slot="share_version">
                    <span v-if="row.share_version">
                        {{row.share_version}}
                    </span>
                    <span v-else>
                        暂无
                    </span>
                </template>


                <template slot-scope="{row, index}" slot="createdAt">
                    {{ moment(row.createdAt).format("YYYY-MM-DD HH:mm") }}
                </template>
            </Table>
        </div>
<!--        <div style="margin: 10px;overflow: hidden">-->
<!--            <div style="float: right;">-->
<!--                <Page v-if="total" :total="total"  :current="page" :prev-text="$lan('prev_page')" :next-text="$lan('next_page')" @on-change="changePage"  show-elevator show-total></Page>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
    export default {
        name: "Desk_top_list",
        data(){
            return {
                form_search:{
                    cellphone: null
                },
                cellphone: localStorage.getItem('cellphone'),
                loading: false,
                search_value: '',
                tableHead: [
                    {
                        title: "邀请人手机号",
                        key: 'uCellphone',
                        align: 'center'
                    },
                    {
                        title: "充值订单号",
                        key: 'orderNo',
                        width: 260,
                        align: 'center'
                    },
                    {
                        title: "充值金额",
                        key: 'record_money',
                        align: 'center'
                    },
                    // {
                    //     title: "分佣金额",
                    //     key: 'createdAt',
                    //     align: 'center'
                    // },
                    {
                        title: "分佣状态",
                        slot: 'share_type',
                        align: 'center'
                    },
                    {
                        title: "提现批次号",
                        slot: 'share_version',
                        align: 'center'
                    },
                    {
                        title: "分佣日期",
                        slot: 'createdAt',
                        align: 'center'
                    }
                ],
                tableData: [],
                total: 100,
                page:1
            }
        },
        mounted() {
            this.get_data();
        },
        methods:{
            async sureApply(){
                let count = this.tableData.reduce((prev,current)=>{
                    if(current.share_type === 1){
                        return prev+current.record_money
                    }else{
                        return prev
                    }
                },0)
                if(!count){
                    this.$Message.error('下级充值待分润总金额为空');
                    return
                }
                let res = await this.Ajax('sureApply')
                this.$Message.success('申请成功!');
                this.get_data()
            },
            async addOneRecod(){
                let res = await this.Ajax('addOneRecod')
            },
            async get_data(){
                console.log("get_data")
                let res = await this.Ajax('getPayList')
                if(res){
                    this.total = res.data.total
                    this.tableData = res.data.items
                }
                // this.Ajax.get(API_URL.get_bill,{
                //     params:{
                //         search_value: this.search_value?this.moment(this.search_value).format("YYYY-MM-DD HH:mm:ss"):'',
                //         page: this.page
                //     }
                // }).then( (res)=>{
                //     if (res.RES == 'SUCCESS') {
                //         this.total = res.DATA.total;
                //         this.tableData = res.DATA.items;
                //     }
                // })
            },
            changePage(page) {
                this.page = page;
                this.get_data()
            }
        }
    }
</script>

<style scoped>
    .color_green{
        color: #19be6b;
    }
    .color_red{
        color: #ed4014;
    }
</style>
