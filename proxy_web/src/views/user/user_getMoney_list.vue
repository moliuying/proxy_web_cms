<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;">
            <Form ref="form_search" inline :label-width="90" label-position="left" style="overflow: hidden; padding-left: 10px;">
<!--                <FormItem label="手机号" prop="cellphone">-->
<!--                    <Input type="text" v-model="form_search.cellphone" clearable placeholder="请输入手机号" style="width: 200px;"></Input>-->
<!--                </FormItem>-->
                <Select v-model="share_type" style="width:200px">
                    <Option  :value="2">客户已申请</Option>
                    <Option  :value="3">提现成功</Option>
                </Select>
                <FormItem>
                    <Button type="info" @click=" get_data ">搜索</Button>
                </FormItem>
            </Form>
        </div>
        <div style="padding: 10px; height: 100%; margin-bottom: 140px;" id="printJS-form">
            <Table row-key="key"  size="small" :columns="tableHead" :data="tableData" border>
                <template slot-scope="{row, index}" slot="action">
                    <template v-if="row.share_type == 2">
                        <Poptip
                                :transfer="true"
                                confirm
                                title=" 批量变更状态为提现成功？ "
                                @on-ok=" sureChangeShareVersion(row.parent, row.share_version) "
                                @on-cancel="     "
                                ok-text="确定"
                                cancel-text="取消"   style="float:right;">
                            <Button type="primary" size="small" class="record_btn" >
                                标记为已打款
                            </Button>
                        </Poptip>
                    </template>
                    <templat v-else-if="row.share_type == 3">
                        打款成功
                    </templat>

                </template>
                <template slot-scope="{row, index}" slot="createdAt">
                    <template v-if="row.createdAt">
                        {{ moment(row.createdAt).format("YYYY-MM-DD HH:mm") }}
                    </template>
                </template>


                <template slot-scope="{row, index}" slot="orderTime">
                    <template v-if="row.orderTime">
                        {{ moment(row.orderTime).format("YYYY-MM-DD HH:mm") }}
                    </template>
                </template>
                <template slot-scope="{row, index}" slot="share_type">
                        <template v-if="row.share_type">
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
                </template>
            </Table>
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
                share_type:2,
                // columns: [
                //     {
                //         title: '申请人手机号',
                //         key: 'applyCellphone',
                //         tree: true
                //     },
                //     {
                //         title: '申请人姓名',
                //         key: 'applyName'
                //     },
                //     {
                //         title: '提现批次号',
                //         key: 'applyVersion'
                //     },
                //     {
                //         title: '申请时间',
                //         key: 'applyTime'
                //     },
                //     {
                //         title: '充值金额',
                //         key: 'applyMoney'
                //     },
                //     {
                //         title: '充值金额2',
                //         slot: 'share_version'
                //     },
                //
                // ],
                data: [
                    {
                        applyName: '111',
                        applyCellphone: '333',
                        applyVersion: '222',
                        applyTime: 18,
                        applyMoney: 20,
                        children: [
                            {
                                applyName: '111',
                                applyCellphone: '333',
                                applyVersion: '222',
                                applyTime: 18,
                                applyMoney: 20,
                            }
                        ]
                    }
                ],
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
                    {
                        title: "操作",
                        slot: 'action',
                        width: 130,
                        align: 'center'
                    },
                    {
                        title: "申请人手机号",
                        key: 'parentCellphone',
                        tree: true,
                        align: 'center'
                    },
                    {
                        title: "提现批次号",
                        key: 'share_version',
                        align: 'center'
                    },
                    {
                        title: "本次总额",
                        key: 'total',
                        align: 'center'
                    },
                    {
                        title: "分佣状态",
                        slot: 'share_type',
                        align: 'center'
                    },
                    {
                        title: "提现日期",
                        slot: 'createdAt',
                        width: 160,
                    },
                    {
                        title: "充值手机号",
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
                    {
                        title: "充值日期",
                        slot: 'orderTime',
                        align: 'center'
                    }
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
            async sureChangeShareVersion(parent,share_version){
                console.log(parent,share_version)
                let res = await this.Ajax('sureChangeShareVersion',{parent,share_version: +share_version})
                this.get_data()
            },
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
                let res = await this.Ajax('getPayList2',{share_type: this.share_type})
                if(res){
                    this.total = res.data.total
                    let arr = res.data.items
                    // let arr  =  [
                    //     {
                    //         "parent": "63184d16b6b9fc06a00bdfae",
                    //         "uid": "63184d16b6b9fc06a00bdfae",
                    //         "uCellphone": "17600261478",
                    //         "orderNo": "47842108486767073771662537025307",
                    //         "record_money": 498,
                    //         "share_money": 0,
                    //         "share_type": 2,
                    //         "share_version": 1,
                    //         'orderTime': "Tue Jun 27 2023 17:17:18 GMT+0800 (China Standard Time)",
                    //         "desc": "",
                    //         "isDelete": false,
                    //         "createdAt": "2023-06-25T11:31:30.177Z",
                    //         "updatedAt": "2023-06-25T11:46:08.946Z",
                    //         "parentCellphone": "13521437290"
                    //     },
                    //     {
                    //         "parent": "63184d16b6b9fc06a00bdfae",
                    //         'orderTime': "Tue Jun 27 2023 17:17:18 GMT+0800 (China Standard Time)",
                    //         "uid": "63184d16b6b9fc06a00bdfae",
                    //         "uCellphone": "17600261478",
                    //         "orderNo": "47842108486767073771662537025307",
                    //         "record_money": 498,
                    //         "share_money": 0,
                    //         "share_type": 2,
                    //         "share_version": 1,
                    //         "desc": "",
                    //         "isDelete": false,
                    //         "createdAt": "2023-06-25T11:24:23.299Z",
                    //         "updatedAt": "2023-06-25T11:46:08.946Z",
                    //         "parentCellphone": "13521437290"
                    //     },
                    //     {
                    //         "parent": "63184d16b6b9fc06a00bdfab",
                    //         "uid": "aaa",
                    //         "uCellphone": "17600261488",
                    //         'orderTime': "Tue Jun 27 2023 17:17:18 GMT+0800 (China Standard Time)",
                    //         "orderNo": "47842108486767073771662537025307",
                    //         "record_money": 498,
                    //         "share_money": 0,
                    //         "share_type": 2,
                    //         "share_version": 2,
                    //         "desc": "",
                    //         "isDelete": false,
                    //         "createdAt": "2023-06-25T11:24:23.299Z",
                    //         "updatedAt": "2023-06-25T11:46:08.946Z",
                    //         "parentCellphone": "13521437295"
                    //     },
                    //     {
                    //         "parent": "63184d16b6b9fc06a00bdfac",
                    //         "uid": "aaa",
                    //         "uCellphone": "17600261488",
                    //         "orderNo": "47842108486767073771662537025307",
                    //         "record_money": 498,
                    //         'orderTime': "Tue Jun 27 2023 17:17:18 GMT+0800 (China Standard Time)",
                    //         "share_money": 0,
                    //         "share_type": 2,
                    //         "share_version": 1,
                    //         "desc": "",
                    //         "isDelete": false,
                    //         "createdAt": "2023-06-25T11:24:23.299Z",
                    //         "updatedAt": "2023-06-25T11:46:08.946Z",
                    //         "parentCellphone": "13521437297"
                    //     }
                    // ]
                    let resultObj = {}
                    for(let item of arr){
                        if(!resultObj[item.parentCellphone+'_'+item.share_version]){
                            resultObj[item.parentCellphone+'_'+item.share_version] = []
                        }
                        resultObj[item.parentCellphone+'_'+item.share_version].push(item)
                    }

                    let result_Arr = []
                    for(let key in resultObj){
                        let parentCellphone = key.split('_')[0]
                        let share_version = key.split('_')[1]
                        let obj = {
                            key,
                            parentCellphone,
                            share_version,
                            parent,
                            children:[]
                        }
                        for(let list of arr){
                            obj["createdAt"] = list.createdAt
                            obj["share_type"] = list.share_type
                            obj["parent"] = list.parent
                            if(list.parentCellphone == parentCellphone && list.share_version == share_version  ){
                                list["parentCellphone"] = ''
                                list["share_version"] = ''
                                list["createdAt"] = ''
                                list["share_type"] = ''
                                list["total"] = ''
                                obj['children'].push(list)
                            }
                            obj["total"] = obj['children'].reduce((prev,current)=>{
                                return prev+current.record_money
                            },0)
                        }
                        result_Arr.push(obj)
                    }
                    console.log(result_Arr)
                    this.tableData = result_Arr
                    // for(let key in){
                    //
                    // }
                    // this.tableData = res.data.items.map(item=>{
                    //     item.chidlren = [
                    //         {
                    //             id: '10100',
                    //             name: 'John Brown',
                    //             age: 18,
                    //             address: 'New York No. 1 Lake Park'
                    //         },
                    //         {
                    //             id: '10101',
                    //             name: 'Joe Blackn',
                    //             age: 30,
                    //             address: 'Sydney No. 1 Lake Park'
                    //         },
                    //         {
                    //             id: '10102',
                    //             name: 'Jon Snow',
                    //             age: 26,
                    //             address: 'Ottawa No. 2 Lake Park',
                    //             children: [
                    //                 {
                    //                     id: '1010200',
                    //                     name: 'Jim Green',
                    //                     age: 24,
                    //                     address: 'New York No. 1 Lake Park'
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    //     return item
                    // })
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
