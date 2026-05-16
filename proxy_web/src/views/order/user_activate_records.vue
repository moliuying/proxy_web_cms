<template>
    <div>
        <div style="margin-bottom: 5px;">
            <Form ref="form_search" inline>
                <!-- 可以在这里添加搜索条件，暂时留空 -->
            </Form>
        </div>
        <Table size="small" border stripe :loading="loading" :columns="tableHead" :data="tableData">
            <template slot-scope="{row, index}" slot="typeText">
                {{ row.typeText }}
            </template>
            <template slot-scope="{row, index}" slot="code">
                {{ row.code }}
            </template>
            <template slot-scope="{row, index}" slot="addDays">
                {{ row.addDays }}天
            </template>
            <template slot-scope="{row, index}" slot="creator">
                {{ row.creator || '系统生成' }}
            </template>
            <template slot-scope="{row, index}" slot="use_time">
                {{ moment(row.use_time).format("YYYY-MM-DD HH:mm") }}
            </template>
        </Table>
<!--        <div style="margin: 10px;overflow: hidden">-->
<!--            <div style="float: right;">-->
<!--                <Page v-if="total" :total="total" :current="page" :prev-text="上一页" :next-text="下一页" @on-change="changePage" show-elevator show-total></Page>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
    export default {
        name: "UserActivateRecords",
        data(){
            return {
                loading: false,
                tableHead: [
                    {
                        title: "激活码类型",
                        slot: 'typeText',
                        align: 'center',
                    },
                    {
                        title: "激活码",
                        slot: 'code',
                        align: 'center',
                        width: 260
                    },
                    {
                        title: "增加天数",
                        slot: 'addDays',
                        align: 'center'
                    },
                    {
                        title: "生成者",
                        slot: 'creator',
                        align: 'center'
                    },
                    {
                        title: "激活时间",
                        slot: 'use_time',
                        align: 'center'
                    }
                ],
                tableData: [],
                total: 0,
                page: 1
            }
        },
        mounted() {
            this.get_data();
        },
        methods:{
            async get_data(){
                this.loading = true;
                try {
                    let res = await this.Ajax('getUserActivateRecords', {page: this.page});
                    if(res){
                        this.total = res.data.total;
                        this.tableData = res.data.tableData;
                    }
                } catch (error) {
                    console.error('获取激活记录失败:', error);
                    this.$Message.error('获取激活记录失败');
                } finally {
                    this.loading = false;
                }
            },
            changePage(page) {
                this.page = page;
                this.get_data();
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
