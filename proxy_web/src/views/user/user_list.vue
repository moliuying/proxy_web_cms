<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;">
            <Form ref="form_search" inline :label-width="90" label-position="left" style="overflow: hidden; padding-left: 10px;">
                <FormItem label="手机号" prop="cellphone">
                    <Input type="text" v-model="form_search.cellphone" clearable placeholder="请输入手机号" style="width: 200px;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="info" @click=" get_data ">搜索</Button>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="primary" @click=" setUser = true ">添加用户</Button>
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
                <template slot-scope="{ row }" slot="createdAt">
                    {{ moment(row.createdAt).format('YYYY-MM-DD') }}
                </template>
                <template slot-scope="{ row }" slot="recordTime">
                    {{ row.recordTime ? moment(row.recordTime).format('YYYY-MM-DD') : '暂未充值' }}
                </template>
                <template slot-scope="{ row }" slot="expireDate">
                    {{  row.expireDate ? moment(row.expireDate).format('YYYY-MM-DD') : '暂未充值' }}
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click=" setExpireDateFn(row) ">设置使用期</Button>
                    <Poptip
                            :transfer="true"
                            confirm
                            :title=" '是否确定删除用户 - '+row.userName "
                            @on-ok="sureDelUser(row) "
                            @on-cancel=""
                            ok-text="确定"
                            cancel-text="取消">
                        <Button type="error" size="small">删除</Button>
                    </Poptip>
<!--                    <Button type="primary" size="small" style="margin-right: 5px" @click=" delOneUser(row) ">删除</Button>-->
<!--                    <Button type="info" size="small" style="margin-right: 5px" v-if=" (uid === '63184d16b6b9fc06a00bdfae' || uid === '632191bed59dcc0a0f2abf46') " @click=" setCampony(row) ">企业管理员</Button>-->
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page v-if="total" :total="total" :current="page" prev-text="上一页" next-text="下一页" @on-change="changePage" show-elevator show-total></Page>
                </div>
            </div>
        </div>


        <Modal
                v-model="setUser"
                title="添加本企业员工"
        >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="100">
                <FormItem prop="cellphone" label="手机号">
                    <Input type="number" v-model="formInline.cellphone" placeholder="请输入手机号" >
                    </Input>
                </FormItem>
                <FormItem prop="userName" label="用户昵称">
                    <Input type="text" v-model="formInline.userName" placeholder="请输入用户姓名" ></Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="text" v-model="formInline.password" password placeholder="请输入密码" ></Input>
                </FormItem>
                <FormItem label="开通至" >
                    <DatePicker type="date" v-model="formInline.expireDate" style="width: 200px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button  @click=" setUser = false ">取消</Button>
                <Button  type="primary"  @click="sureAddUser">确定</Button>
            </div>
        </Modal>

        <Modal
                v-model="setExpireDate"
                :title=" '手机号'+cellphone"
        >
            <Form ref="form" :label-width="200">
                <FormItem label="开通至" >
                    <DatePicker type="date" v-model="expireDate" style="width: 200px" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button  @click=" setExpireDate = false ">取消</Button>
                <Button  type="primary"  @click="sureSetExpireDate">确定</Button>
            </div>
        </Modal>

        <Modal
                v-model="setCamponyModal"
                title="编辑企业名称"
        >
            <Form ref="form" :label-width="80">
                <FormItem label="企业名称">
                    <Input type="text" v-model="companyName" clearable placeholder="请输入企业名称"></Input>
                </FormItem>
                <RadioGroup v-model="roleType">
                    <Radio :label="0">恢复为普通用户</Radio>
                    <Radio :label="1">设为企业管理员</Radio>
                </RadioGroup>
            </Form>
            <div slot="footer">
                <Button  @click=" setCamponyModal = false ">取消</Button>
                <Button  type="primary"  @click="sureSetCampany">确定</Button>
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
                    cellphone: '',
                    userName: '',
                    password: '',
                    expireDate: ''
                },
                ruleInline: {
                    cellphone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ]
                },
                uid: localStorage.getItem('uid'),
                companyName: null,
                roleType: 0,
                setCamponyModal: false,
                setUser: false,
                _id: null,
                expireDate: null,
                cellphone: null,
                setExpireDate: false,
                form_search:{
                    cellphone: null
                },
                ifShowModal: false,
                loading: true,
                tableHead: [
                    { title: '手机号', key: 'cellphone', align: 'center' },
                    { title: '用户名', key: 'userName', align: 'center'  },
                    // { title: '公司名', key: 'companyName', align: 'center'  },
                    { title: '注册时间', key: 'createdAt', align: 'center', slot: 'createdAt'},
                    { title: '上次充值时间', key: 'recordTime', align: 'center', slot: 'recordTime'},
                    { title: '到期时间', key: 'updateAt', align: 'center', slot: 'expireDate' },
                    { title: '操作', align: 'center', slot: 'action', width: 400 }
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
            async sureDelUser(row){
                let res = await this.Ajax('delOneUser',{_id: row._id})
                console.log(res)
                if(res) {
                    this.$Message.success('删除成功!');
                    this.get_data()
                }
            },
            async sureAddUser(){
                // 企业管理员添加员工
                let ifOk = await this.$refs['formInline'].validate()
                if(ifOk){
                    let res = await this.Ajax('addOneUser',this.formInline)
                    console.log(res)
                    if(res){
                        this.$Message.success('添加成功!');
                        this.get_data()
                        this.$refs['formInline'].resetFields()
                        this.setUser = false
                    }
                }
            },
            async sureSetExpireDate(){
                if(!this.expireDate){
                    this.expireDate = null
                }
                await this.Ajax('sureSetExpireDate', {_id: this._id, expireDate: moment(this.expireDate).format('YYYY-MM-DD')})

                this.get_data()
                this.expireDate = null;
                this.cellphone = null
                this._id = null
                this.setExpireDate = false
                Message.success("设置成功")
            },
            setCampony(row){
                this.companyName = row.companyName || null
                this._id = row['_id'];
                this.setCamponyModal = true
            },
            async sureSetCampany(){
                if( this.roleType === 1 && !this.companyName){
                    Message.error("企业管理员必须填写企业名称")
                    return
                }
                let res = await this.Ajax('set_campany', {
                    _id: this._id,
                    companyName: this.companyName,
                    roleType: this.roleType
                })
                this.companyName = null
                this.roleType = 0
                this._id = null
                this.setCamponyModal = false
                Message.success("设置成功")
            },
            setExpireDateFn(row){
                this.expireDate = row['expireDate'];
                this.cellphone = row['cellphone'];
                this._id = row['_id'];
                this.setExpireDate = true
            },
            async get_data() {
                this.loading = true
                //获取自己当前属性
                let query = { page: this.page }
                if(this.form_search.cellphone){
                    query["cellphone"] = this.form_search.cellphone
                }
                let res = await this.Ajax('get_users', query)
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
    /deep/ .ivu-modal-body{
        display: flex !important;
        justify-content: space-around;
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
