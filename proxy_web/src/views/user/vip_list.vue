<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;" class="form-container">
            <Form ref="form_search" inline :label-width="90" label-position="left" style="overflow: visible; padding-left: 10px;">
                <FormItem label="激活码类型" prop="type">
                    <Select v-model="form_search.type" clearable placeholder="请选择激活码类型" style="width: 150px;" transfer>
                        <Option value="1">月度</Option>
                        <Option value="2">季度</Option>
                        <Option value="3">年度</Option>
                    </Select>
                </FormItem>
                <FormItem label="使用状态" prop="is_use">
                    <Select v-model="form_search.is_use" clearable placeholder="请选择使用状态" style="width: 150px;" transfer>
                        <Option value="0">未使用</Option>
                        <Option value="1">已使用</Option>
                    </Select>
                </FormItem>
<!--                <FormItem label="创建人" prop="creator">-->
<!--                    <Input type="text" v-model="form_search.creator" clearable placeholder="请输入创建人" style="width: 150px;"></Input>-->
<!--                </FormItem>-->
                <FormItem>
                    <Button type="info" @click=" get_data ">搜索</Button>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="primary" @click=" addVipCode = true ">生成激活码</Button>
                </FormItem>
                <FormItem style="float: right;">
<!--                    <Poptip-->
<!--                            :transfer="true" confirm ok-text="确定"  cancel-text="取消"-->
<!--                            title="是否确定进行结算战斗"-->
<!--                            v-if=" uNum <= 50 "-->
<!--                            @on-ok="jiesuanZhandou">-->
<!--                        <Button type="success">结算战斗</Button>-->
<!--                    </Poptip>-->
                </FormItem>
            </Form>
        </div>
        <div style="padding: 10px; height: 100%; margin-bottom: 140px;" id="printJS-form">
            <Table border stripe :loading="loading" :columns="tableHead" :data="tableData">
                <template slot-scope="{ row }" slot="type">
                    {{ row.type === '1' ? '月度' : row.type === '2' ? '季度' : row.type === '3' ? '年度' : '未知' }}
                </template>
                <template slot-scope="{ row }" slot="createdAt">
                    {{ moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template slot-scope="{ row }" slot="is_use">
                    <Tag :color="row.is_use === 1 ? 'success' : 'default'">{{ row.is_use === 1 ? '已使用' : '未使用' }}</Tag>
                </template>
                <template slot-scope="{ row }" slot="use_time">
                    {{ row.use_time ? moment(row.use_time).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="info" size="small" style="margin-right: 5px" v-if="row.is_use === 0" @click=" copyCode(row.code) ">复制激活码</Button>
                    <Poptip
                            :transfer="true"
                            confirm
                            :title=" '是否确定删除激活码？' "
                            @on-ok="sureDelVipCode(row) "
                            @on-cancel=""
                            ok-text="确定"
                            cancel-text="取消">
                        <Button type="error" size="small">删除</Button>
                    </Poptip>
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page v-if="total" :total="total" :current="page" prev-text="上一页" next-text="下一页" @on-change="changePage" show-elevator show-total></Page>
                </div>
            </div>
        </div>


        <Modal
                v-model="addVipCode"
                title="生成激活码"
        >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
                <FormItem prop="type" label="激活码类型">
                    <Select v-model="formInline.type" placeholder="请选择激活码类型" transfer>
                        <Option value="1">月度</Option>
                        <Option value="2">季度</Option>
                        <Option value="3">年度</Option>
                    </Select>
                </FormItem>
                <FormItem prop="count" label="生成数量">
                    <InputNumber v-model="formInline.count" :min="1" :max="100" placeholder="请输入生成数量"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button  @click=" addVipCode = false ">取消</Button>
                <Button  type="primary"  @click="sureAddVipCode">确定</Button>
            </div>
        </Modal>




    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import print from 'print-js'
    import { Message } from 'view-design'
    const moment = require("moment")
    export default {
        data() {
            return {
                formInline: {
                    type: '',
                    count: 1
                },
                ruleInline: {
                    type: [
                        {required: true, message: '激活码类型不能为空', trigger: 'change'}
                    ],
                    count: [
                        {validator: (rule, value, callback) => {
                            if (!value && value !== 0) {
                                callback(new Error('生成数量不能为空'));
                            } else if (Number(value) < 1 || Number(value) > 100) {
                                callback(new Error('生成数量必须在1-100之间'));
                            } else {
                                callback();
                            }
                        }, trigger: 'change'}
                    ]
                },
                uid: localStorage.getItem('uid'),
                addVipCode: false,
                _id: null,
                form_search:{
                    type: null,
                    is_use: null,
                    creator: null
                },
                ifShowModal: false,
                loading: true,
                tableHead: [
                    { title: '激活码', key: 'code', align: 'center', width: 240 },
                    { title: '类型', key: 'type', align: 'center', slot: 'type' },
                    { title: '创建人', key: 'creator', align: 'center' },
                    { title: '创建时间', key: 'createdAt', align: 'center', slot: 'createdAt', width: 180},
                    { title: '使用状态', key: 'is_use', align: 'center', slot: 'is_use'},
                    { title: '使用人', key: 'user', align: 'center' },
                    { title: '使用时间', key: 'use_time', align: 'center', slot: 'use_time', width: 180 },
                    { title: '操作', align: 'center', slot: 'action', width: 200 }
                ],
                tableData: [],
                total: 0,
                page: 1
            }
        },
        watch: {},
        mounted() {
            this.get_data()
        },
        methods: {
            async sureDelVipCode(row){
                let res = await this.Ajax('delVipCode',{_id: row._id})
                console.log(res)
                if(res) {
                    this.$Message.success('删除成功!');
                    this.get_data()
                }
            },
            async sureAddVipCode(){
                let ifOk = await this.$refs['formInline'].validate()
                if(ifOk){
                    let res = await this.Ajax('addVipCode',this.formInline)
                    console.log(res)
                    if(res){
                        this.$Message.success('生成成功!');
                        this.get_data()
                        this.$refs['formInline'].resetFields()
                        this.addVipCode = false
                    }
                }
            },
            copyCode(code) {
                navigator.clipboard.writeText(code).then(() => {
                    this.$Message.success('激活码已复制到剪贴板!');
                }).catch(() => {
                    this.$Message.error('复制失败，请手动复制!');
                });
            },

            async get_data() {
                this.loading = true
                let query = { page: this.page }
                if(this.form_search.type){
                    query["type"] = this.form_search.type
                }
                if(this.form_search.is_use !== null){
                    query["is_use"] = this.form_search.is_use
                }
                // if(this.form_search.creator){
                //     query["creator"] = this.form_search.creator
                // }
                let res = await this.Ajax('get_vip_codes', query)
                if(res){
                    this.total = res.data.total
                    this.tableData = res.data.tableData
                }
                this.loading = false
            },
            changePage(page) {
                this.page = page
                this.get_data()
            }
        }
    }
</script>
<style scoped>
    ::v-deep .ivu-modal-body{
        display: flex !important;
        justify-content: space-around;
    }

    /* 确保下拉框能正常显示 */
    ::v-deep .ivu-select-dropdown {
        z-index: 9999 !important;
    }

    /* 确保表单容器不会裁剪下拉框 */
    .form-container {
        overflow: visible !important;
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vertical-center-modal .ivu-modal {
        top: 0;
    }

    .title {
        height: 50px;
        color: #333;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
    }
</style>
