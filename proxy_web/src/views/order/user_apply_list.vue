<template>
    <div >
        <div style="margin-bottom: 5px;">
            <Form ref="form_search"   inline>
<!--                <FormItem prop="value">-->
<!--                    <DatePicker type="date" v-model="search_value"  placeholder="请选择查询日期" style="width: 200px"></DatePicker>-->
<!--                </FormItem>-->
<!--                <FormItem>-->
<!--                    <Button type="primary" @click=" get_data " >456</Button>-->
<!--                </FormItem>-->
            </Form>
        </div>
        <Table size="small" border stripe :loading="loading" :columns="tableHead" :data="tableData">
            <template slot-scope="{row, index}" slot="createdAt">
               {{ moment(row.createdAt).format("YYYY-MM-DD HH:mm") }}
            </template>
        </Table>
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
                loading: false,
                search_value: '',
                tableHead: [
                    {
                        title: "邀请人姓名",
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: "邀请人手机号",
                        key: 'cellphone',
                        align: 'center'
                    },
                    {
                        title: "邀请日期",
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
            async get_data(){
                console.log("get_data")
                let res = await this.Ajax('getApplyList',{page: this.page})
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
