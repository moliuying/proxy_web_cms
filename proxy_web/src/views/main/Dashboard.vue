<template>
    <div class="dashboard">
        <div class="page-header">
            <h2>数据大盘</h2>
            <p class="subtitle">实时监控系统运营数据</p>
        </div>

        <div class="stat-cards">
            <div class="stat-card card-blue">
                <div class="card-icon">
                    <Icon type="md-people" :size="36" />
                </div>
                <div class="card-content">
                    <p class="card-value">{{ stats.totalUsers }}</p>
                    <p class="card-label">总用户数</p>
                    <p class="card-trend" v-if="stats.todayNewUsers > 0">
                        <Icon type="md-arrow-round-up" /> 今日新增 {{ stats.todayNewUsers }}
                    </p>
                </div>
            </div>

            <div class="stat-card card-green">
                <div class="card-icon">
                    <Icon type="md-ribbon" :size="36" />
                </div>
                <div class="card-content">
                    <p class="card-value">{{ stats.totalVipUsers }}</p>
                    <p class="card-label">VIP会员数</p>
                    <p class="card-trend warning" v-if="stats.expireSoonUsers > 0">
                        <Icon type="md-alert" /> 即将到期 {{ stats.expireSoonUsers }}
                    </p>
                </div>
            </div>

            <div class="stat-card card-orange">
                <div class="card-icon">
                    <Icon type="md-cart" :size="36" />
                </div>
                <div class="card-content">
                    <p class="card-value">{{ stats.totalOrders }}</p>
                    <p class="card-label">总订单数</p>
                    <p class="card-trend" v-if="stats.todayOrders > 0">
                        <Icon type="md-arrow-round-up" /> 今日订单 {{ stats.todayOrders }}
                    </p>
                </div>
            </div>

            <div class="stat-card card-purple">
                <div class="card-icon">
                    <Icon type="logo-yen" :size="36" />
                </div>
                <div class="card-content">
                    <p class="card-value">¥{{ stats.totalIncome }}</p>
                    <p class="card-label">总收入</p>
                    <p class="card-trend" v-if="stats.todayIncome > 0">
                        <Icon type="md-arrow-round-up" /> 今日收入 ¥{{ stats.todayIncome }}
                    </p>
                </div>
            </div>

            <div class="stat-card card-cyan">
                <div class="card-icon">
                    <Icon type="md-key" :size="36" />
                </div>
                <div class="card-content">
                    <p class="card-value">{{ stats.totalVipCodes }}</p>
                    <p class="card-label">激活码总数</p>
                    <p class="card-trend">
                        已使用 {{ stats.usedVipCodes }} / 未使用 {{ stats.unusedVipCodes }}
                    </p>
                </div>
            </div>

            <div class="stat-card card-red">
                <div class="card-icon">
                    <Icon type="md-globe" :size="36" />
                </div>
                <div class="card-content">
                    <p class="card-value">{{ stats.totalProxies }}</p>
                    <p class="card-label">代理窗口数</p>
                    <p class="card-trend">
                        当前运行中
                    </p>
                </div>
            </div>
        </div>

        <div class="charts-row">
            <div class="chart-panel income-chart">
                <div class="panel-header filter-header">
                    <h3>{{ periodTitle }}收入趋势</h3>
                    <div class="filter-group">
                        <div class="filter-item">
                        <label>时间范围：</label>
                        <Select v-model="periodType" style="width: 120px" @on-change="loadStats">
                            <Option value="7days">近7天</Option>
                            <Option value="month">本月</Option>
                            <Option value="months">近12个月</Option>
                            <Option value="year">本年</Option>
                        </Select>
                    </div>
                    <div class="filter-item">
                        <label>支付方式：</label>
                        <Select v-model="paymentType" style="width: 120px" @on-change="loadStats">
                            <Option value="all">全部</Option>
                            <Option value="wechat">微信</Option>
                            <Option value="alipay">支付宝</Option>
                            <Option value="vipcode">激活码</Option>
                        </Select>
                    </div>
                    <div class="filter-item payment-hint">
                        <Tooltip content="支付方式判断依据：微信支付(recordWay=1)、支付宝(recordWay=2)、激活码(recordWay=3)" placement="top">
                            <Icon type="md-help-circle" :size="16" />
                        </Tooltip>
                    </div>
                    </div>
                </div>
                <div class="chart-summary">
                    <div class="summary-item">
                        <span class="summary-label">总收入：</span>
                        <span class="summary-value">¥{{ stats.filteredTotalIncome || 0 }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">总笔数：</span>
                        <span class="summary-value">{{ totalTransactionCount }}笔</span>
                    </div>
                </div>
                <div class="chart-container">
                    <div class="income-bars">
                        <div class="bar-item" v-for="(item, index) in incomeChartData" :key="index">
                            <div class="bar-wrapper">
                                <div class="bar-fill" :style="{ height: (item.income / maxIncome * 100) + '%' }">
                                    <span class="bar" :style="{ height: '100%' }"></span>
                                </div>
                                <span class="bar-tooltip">¥{{ item.income }}</span>
                            </div>
                            <p class="bar-label">{{ item.date }}</p>
                            <p class="bar-count">{{ item.count }}笔</p>
                        </div>
                        <div class="bar-item" v-if="incomeChartData.length === 0">
                            <p class="empty-text">暂无数据</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chart-panel vip-chart">
                <div class="panel-header">
                    <h3>收入来源分布</h3>
                </div>
                <div class="payment-stats">
                    <div class="payment-item" v-for="(item, index) in paymentTypeList" :key="index">
                        <div class="payment-header">
                            <span class="payment-name">
                                <Icon :type="getPaymentIcon(item._id)" :size="16" />
                                {{ getPaymentName(item._id) }}
                            </span>
                            <span class="payment-count">{{ item.count }}笔</span>
                        </div>
                        <div class="payment-amount">¥{{ item.total }}</div>
                        <div class="payment-progress">
                            <div class="progress-bg">
                                <div class="progress-fill" :class="'payment-' + item._id" :style="{ width: getPaymentPercent(item.total) + '%' }"></div>
                            </div>
                        </div>
                        <div class="payment-percent">{{ getPaymentPercent(item.total).toFixed(1) }}%</div>
                    </div>
                    <div class="empty-text" v-if="paymentTypeList.length === 0">暂无数据</div>
                </div>
            </div>
        </div>

        <div class="charts-row">
            <div class="chart-panel">
                <div class="panel-header">
                    <h3>近30天用户增长趋势</h3>
                </div>
                <div class="chart-container">
                    <div class="income-bars">
                        <div class="bar-item" v-for="(item, index) in stats.userGrowthTrend" :key="index">
                            <div class="bar-wrapper">
                                <div class="bar-fill" :style="{ height: (item.count / maxUserGrowth * 100) + '%' }">
                                    <span class="bar bar-green" :style="{ height: '100%' }"></span>
                                </div>
                                <span class="bar-tooltip">{{ item.count }}人</span>
                            </div>
                            <p class="bar-label">{{ item._id.substr(5) }}</p>
                        </div>
                        <div class="bar-item" v-if="stats.userGrowthTrend.length === 0">
                            <p class="empty-text">暂无数据</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chart-panel">
                <div class="panel-header">
                    <h3>订单状态统计</h3>
                </div>
                <div class="order-stats">
                    <div class="order-stat-item success">
                        <div class="order-stat-icon">
                            <Icon type="md-checkmark-circle" :size="28" />
                        </div>
                        <div class="order-stat-content">
                            <p class="order-stat-value">{{ orderSuccessCount }}</p>
                            <p class="order-stat-label">支付成功</p>
                            <p class="order-stat-amount">¥{{ orderSuccessAmount }}</p>
                        </div>
                    </div>
                    <div class="order-stat-item pending">
                        <div class="order-stat-icon">
                            <Icon type="md-time" :size="28" />
                        </div>
                        <div class="order-stat-content">
                            <p class="order-stat-value">{{ orderPendingCount }}</p>
                            <p class="order-stat-label">待支付</p>
                            <p class="order-stat-amount">近30天</p>
                        </div>
                    </div>
                    <div class="order-stat-item total">
                        <div class="order-stat-icon">
                            <Icon type="md-reorder" :size="28" />
                        </div>
                        <div class="order-stat-content">
                            <p class="order-stat-value">{{ orderTotalCount }}</p>
                            <p class="order-stat-label">总订单</p>
                            <p class="order-stat-amount">成功率: {{ orderTotalCount > 0 ? Math.round(orderSuccessCount / orderTotalCount * 100) : 0 }}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="charts-row">
            <div class="chart-panel">
                <div class="panel-header">
                    <h3>代理平台分布</h3>
                </div>
                <div class="platform-stats">
                    <div class="platform-item" v-for="(item, index) in stats.proxyPlatformStats" :key="index">
                        <div class="platform-header">
                            <span class="platform-name">{{ item._id || '未设置' }}</span>
                            <span class="platform-count">{{ item.count }}个</span>
                        </div>
                        <div class="platform-progress">
                            <div class="progress-bg">
                                <div class="progress-fill" :style="{ width: stats.totalProxies > 0 ? (item.count / stats.totalProxies * 100) + '%' : '0%' }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="empty-text" v-if="stats.proxyPlatformStats.length === 0">暂无数据</div>
                </div>
            </div>

            <div class="chart-panel">
                <div class="panel-header">
                    <h3>充值金额分布</h3>
                </div>
                <div class="recharge-stats">
                    <div class="recharge-item" v-for="(item, index) in stats.rechargeDistribution" :key="index">
                        <div class="recharge-header">
                            <span class="recharge-name">{{ item._id }}</span>
                            <span class="recharge-count">{{ item.count }}笔</span>
                        </div>
                        <div class="recharge-detail">
                            <span class="recharge-amount">¥{{ item.total }}</span>
                            <span class="recharge-avg">平均 ¥{{ Math.round(item.total / item.count) }}</span>
                        </div>
                    </div>
                    <div class="empty-text" v-if="stats.rechargeDistribution.length === 0">暂无数据</div>
                </div>
            </div>
        </div>

        <div class="detail-tabs-panel">
            <div class="panel-header tabs-header">
                <h3>数据明细</h3>
                <div class="tabs">
                    <div class="tab-item" :class="{ active: activeDetailTab === 'users' }" @click="activeDetailTab = 'users'">
                        <Icon type="md-people" /> 最近注册
                    </div>
                    <div class="tab-item" :class="{ active: activeDetailTab === 'expire' }" @click="activeDetailTab = 'expire'">
                        <Icon type="md-alert" /> 即将到期
                    </div>
                    <div class="tab-item" :class="{ active: activeDetailTab === 'proxies' }" @click="activeDetailTab = 'proxies'">
                        <Icon type="md-globe" /> 代理窗口
                    </div>
                    <div class="tab-item" :class="{ active: activeDetailTab === 'orders' }" @click="activeDetailTab = 'orders'">
                        <Icon type="md-cart" /> 订单记录
                    </div>
                    <div class="tab-item" :class="{ active: activeDetailTab === 'bills' }" @click="activeDetailTab = 'bills'">
                        <Icon type="logo-yen" /> 充值记录
                    </div>
                </div>
            </div>
            <div class="tab-content">
                <Table v-show="activeDetailTab === 'users'" :columns="userColumns" :data="stats.recentUsers" :loading="loading">
                    <template slot-scope="{ row }" slot="yue">
                        <span style="color: #19be6b; font-weight: 600;">¥{{ row.yue }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="roleType">
                        <Tag :color="row.roleType === 1 ? 'red' : 'blue'">
                            {{ row.roleType === 1 ? '管理员' : '普通用户' }}
                        </Tag>
                    </template>
                    <template slot-scope="{ row }" slot="expireDate">
                        <span>{{ row.expireDate ? formatDate(row.expireDate) : '未开通' }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="createdAt">
                        <span>{{ formatDate(row.createdAt) }}</span>
                    </template>
                </Table>
                <Table v-show="activeDetailTab === 'expire'" :columns="expireSoonColumns" :data="stats.expireSoonUserList" :loading="loading">
                    <template slot-scope="{ row }" slot="expireDate">
                        <span style="color: #ff9900; font-weight: 600;">{{ formatDate(row.expireDate) }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="daysLeft">
                        <Tag :color="Math.ceil((new Date(row.expireDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 3 ? 'red' : 'orange'">
                            {{ Math.ceil((new Date(row.expireDate) - new Date()) / (1000 * 60 * 60 * 24)) }}天
                        </Tag>
                    </template>
                </Table>
                <Table v-show="activeDetailTab === 'proxies'" :columns="proxyColumns" :data="stats.recentProxies" :loading="loading">
                    <template slot-scope="{ row }" slot="userName">
                        <span>{{ row.uid ? row.uid.userName : '-' }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="pingtai">
                        <Tag color="blue">{{ row.pingtai || '未设置' }}</Tag>
                    </template>
                    <template slot-scope="{ row }" slot="createdAt">
                        <span>{{ formatDate(row.createdAt) }}</span>
                    </template>
                </Table>
                <Table v-show="activeDetailTab === 'orders'" :columns="orderColumns" :data="stats.recentOrders" :loading="loading">
                    <template slot-scope="{ row }" slot="orderUserName">
                        <span>{{ row.uid ? row.uid.userName : '-' }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="money">
                        <span style="color: #19be6b; font-weight: 600;">¥{{ row.money }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="orderType">
                        <Tag :color="row.type === 'wechat' ? 'success' : 'primary'">
                            {{ row.type === 'wechat' ? '微信' : '支付宝' }}
                        </Tag>
                    </template>
                    <template slot-scope="{ row }" slot="orderStatus">
                        <Tag :color="row.ifGetVxResponse ? 'success' : 'default'">
                            {{ row.ifGetVxResponse ? '支付成功' : '待支付' }}
                        </Tag>
                    </template>
                    <template slot-scope="{ row }" slot="createdAt">
                        <span>{{ formatDate(row.createdAt) }}</span>
                    </template>
                </Table>
                <Table v-show="activeDetailTab === 'bills'" :columns="billColumns" :data="stats.recentBills" :loading="loading">
                    <template slot="recordWay" slot-scope="{ row }">
                        <Tag :color="row.recordWay === 1 ? 'success' : (row.recordWay === 2 ? 'primary' : 'orange')">
                            {{ row.recordWay === 1 ? '微信' : (row.recordWay === 2 ? '支付宝' : '激活码') }}
                        </Tag>
                    </template>
                    <template slot="add_money" slot-scope="{ row }">
                        <span class="money">+¥{{ row.add_money }}</span>
                    </template>
                    <template slot="createdAt" slot-scope="{ row }">
                        {{ formatDate(row.createdAt) }}
                    </template>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {
        name: 'Dashboard',
        data() {
            return {
                loading: true,
                periodType: '7days',
                paymentType: 'all',
                stats: {
                    totalUsers: 0,
                    todayNewUsers: 0,
                    totalVipUsers: 0,
                    expireSoonUsers: 0,
                    totalOrders: 0,
                    todayOrders: 0,
                    totalIncome: 0,
                    todayIncome: 0,
                    totalVipCodes: 0,
                    usedVipCodes: 0,
                    unusedVipCodes: 0,
                    totalProxies: 0,
                    recentBills: [],
                    incomeTrend: [],
                    vipTypeStats: [],
                    recentUsers: [],
                    expireSoonUserList: [],
                    proxyPlatformStats: [],
                    recentProxies: [],
                    orderStatusStats: [],
                    recentOrders: [],
                    userGrowthTrend: [],
                    rechargeDistribution: [],
                    paymentTypeStats: [],
                    filteredTotalIncome: 0
                },
                activeDetailTab: 'users',
                billColumns: [
                    { title: '订单号', key: 'orderNo', minWidth: 200},
                    { title: '充值方式', slot: 'recordWay', width: 100},
                    { title: '金额', slot: 'add_money', width: 100},
                    { title: '充值前余额', key: 'prev_money', width: 120},
                    { title: '充值后余额', key: 'now_money', width: 120},
                    { title: '充值时长', key: 'custom_days', width: 100},
                    { title: '时间', slot: 'createdAt', minWidth: 160}
                ],
                userColumns: [
                    { title: '用户名', key: 'userName', minWidth: 120},
                    { title: '手机号', key: 'cellphone', width: 130},
                    { title: '余额', slot: 'yue', width: 100},
                    { title: '角色', slot: 'roleType', width: 80},
                    { title: '到期时间', slot: 'expireDate', width: 160},
                    { title: '注册时间', slot: 'createdAt', minWidth: 160}
                ],
                expireSoonColumns: [
                    { title: '用户名', key: 'userName', minWidth: 120},
                    { title: '手机号', key: 'cellphone', width: 130},
                    { title: '到期时间', slot: 'expireDate', width: 160},
                    { title: '剩余天数', slot: 'daysLeft', width: 100}
                ],
                proxyColumns: [
                    { title: '代理名称', key: 'proxy_name', minWidth: 120},
                    { title: '所属用户', slot: 'userName', width: 100},
                    { title: '平台', slot: 'pingtai', width: 100},
                    { title: '代理IP', key: 'proxy_ip', width: 130},
                    { title: '创建时间', slot: 'createdAt', minWidth: 160}
                ],
                orderColumns: [
                    { title: '订单号', key: 'orderNo', minWidth: 200},
                    { title: '用户', slot: 'orderUserName', width: 100},
                    { title: '金额', slot: 'money', width: 100},
                    { title: '支付方式', slot: 'orderType', width: 100},
                    { title: '状态', slot: 'orderStatus', width: 100},
                    { title: '创建时间', slot: 'createdAt', minWidth: 160}
                ]
            }
        },
        computed: {
            periodTitle() {
                const map = {
                    '7days': '近7天',
                    'month': '本月',
                    'months': '近12个月',
                    'year': '本年'
                }
                return map[this.periodType] || '近7天'
            },
            incomeChartData() {
                return this.stats.incomeTrend.map(item => {
                    let date = item._id
                    if (this.periodType === 'year' || this.periodType === 'months') {
                        const parts = item._id.split('-')
                        date = parts[1] + '月'
                    } else {
                        date = item._id.substr(5)
                    }
                    return {
                        date: date,
                        income: item.income,
                        count: item.count
                    }
                })
            },
            maxIncome() {
                if (this.incomeChartData.length === 0) return 100
                return Math.max(...this.incomeChartData.map(item => item.income), 100)
            },
            vipTypeList() {
                return this.stats.vipTypeStats || []
            },
            paymentTypeList() {
                return this.stats.paymentTypeStats || []
            },
            totalTransactionCount() {
                return this.stats.incomeTrend.reduce((sum, item) => sum + item.count, 0)
            },
            totalPaymentAmount() {
                return this.paymentTypeList.reduce((sum, item) => sum + item.total, 0)
            },
            maxUserGrowth() {
                if (this.stats.userGrowthTrend.length === 0) return 10
                return Math.max(...this.stats.userGrowthTrend.map(item => item.count), 10)
            },
            orderSuccessCount() {
                const success = this.stats.orderStatusStats.find(item => item._id === true)
                return success ? success.count : 0
            },
            orderSuccessAmount() {
                const success = this.stats.orderStatusStats.find(item => item._id === true)
                return success ? success.totalAmount : 0
            },
            orderPendingCount() {
                const pending = this.stats.orderStatusStats.find(item => item._id === false)
                return pending ? pending.count : 0
            },
            orderTotalCount() {
                return this.orderSuccessCount + this.orderPendingCount
            }
        },
        mounted() {
            this.loadStats()
        },
        methods: {
            async loadStats() {
                this.loading = true
                try {
                    const res = await this.Ajax('getDashboardStats', {
                        periodType: this.periodType,
                        paymentType: this.paymentType
                    }, 'post')
                    console.log('dashboard stats response:', res)
                    if (res && res.code === 200) {
                        this.stats = res.data
                        console.log('final stats:', this.stats)
                    } else {
                        var errMsg = res && res.msg ? res.msg : '加载数据失败'
                        this.$Message.error(errMsg)
                    }
                } catch (e) {
                    console.error('load stats error:', e)
                    this.$Message.error('加载数据失败')
                } finally {
                    this.loading = false
                }
            },
            getVipTypeName(type) {
                const map = { '1': '月卡', '2': '季度卡', '3': '年卡' }
                return map[type] || type
            },
            getPaymentName(type) {
                const map = { 1: '微信支付', 2: '支付宝', 3: '激活码' }
                return map[type] || '其他'
            },
            getPaymentIcon(type) {
                const map = { 1: 'logo-wechat', 2: 'logo-alipay', 3: 'md-key' }
                return map[type] || 'md-card'
            },
            getPaymentPercent(total) {
                if (this.totalPaymentAmount === 0) return 0
                return (total / this.totalPaymentAmount) * 100
            },
            formatDate(date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    }
</script>

<style scoped>
    .dashboard {
        padding: 20px;
        background: #f5f7f9;
        min-height: 100%;
    }

    .page-header {
        margin-bottom: 24px;
    }

    .page-header h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        color: #17233d;
        font-weight: 600;
    }

    .subtitle {
        margin: 0;
        color: #808695;
        font-size: 14px;
    }

    .stat-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
    }

    .stat-card {
        background: #fff;
        border-radius: 8px;
        padding: 24px;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-right: 20px;
        flex-shrink: 0;
    }

    .card-blue .card-icon {
        background: linear-gradient(135deg, #2d8cf0, #5cadff);
    }

    .card-green .card-icon {
        background: linear-gradient(135deg, #19be6b, #47cb89);
    }

    .card-orange .card-icon {
        background: linear-gradient(135deg, #ff9900, #ffb84d);
    }

    .card-purple .card-icon {
        background: linear-gradient(135deg, #722ed1, #9254de);
    }

    .card-cyan .card-icon {
        background: linear-gradient(135deg, #13c2c2, #36cfc9);
    }

    .card-red .card-icon {
        background: linear-gradient(135deg, #f5222d, #ff4d4f);
    }

    .card-content {
        flex: 1;
    }

    .card-value {
        margin: 0 0 4px 0;
        font-size: 28px;
        font-weight: 600;
        color: #17233d;
    }

    .card-label {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #515a6e;
    }

    .card-trend {
        margin: 0;
        font-size: 12px;
        color: #19be6b;
    }

    .card-trend.warning {
        color: #ff9900;
    }

    .charts-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
    }

    .chart-panel {
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .panel-header {
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
    }

    .panel-header h3 {
        margin: 0;
        font-size: 16px;
        color: #17233d;
        font-weight: 600;
    }

    .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
    }

    .filter-group {
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
    }

    .filter-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .filter-item label {
        font-size: 14px;
        color: #515a6e;
        margin: 0;
    }

    .payment-hint {
        color: #808695;
        cursor: help;
    }

    .chart-summary {
        display: flex;
        gap: 24px;
        margin-bottom: 16px;
        padding: 12px 16px;
        background: #f8f8f9;
        border-radius: 6px;
    }

    .summary-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .summary-label {
        font-size: 14px;
        color: #515a6e;
    }

    .summary-value {
        font-size: 18px;
        font-weight: 600;
        color: #2d8cf0;
    }

    .payment-stats {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .payment-item {
        padding: 12px;
        background: #f8f8f9;
        border-radius: 6px;
    }

    .payment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .payment-name {
        font-size: 14px;
        color: #17233d;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .payment-count {
        font-size: 12px;
        color: #808695;
    }

    .payment-amount {
        font-size: 18px;
        font-weight: 600;
        color: #19be6b;
        margin-bottom: 8px;
    }

    .payment-progress {
        margin-bottom: 4px;
    }

    .payment-percent {
        font-size: 12px;
        color: #808695;
        text-align: right;
    }

    .payment-1 {
        background: linear-gradient(90deg, #19be6b, #47cb89);
    }

    .payment-2 {
        background: linear-gradient(90deg, #2d8cf0, #5cadff);
    }

    .payment-3 {
        background: linear-gradient(90deg, #ff9900, #ffb84d);
    }

    .chart-container {
        height: 280px;
        padding: 20px 0;
    }

    .income-bars {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        height: 100%;
        gap: 12px;
    }

    .bar-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
    }

    .bar-wrapper {
        width: 40px;
        height: 70%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        position: relative;
    }

    .bar-fill {
        width: 100%;
        display: flex;
        align-items: flex-end;
        position: relative;
    }

    .bar {
        width: 100%;
        background: linear-gradient(180deg, #2d8cf0, #5cadff);
        border-radius: 4px 4px 0 0;
        transition: height 0.5s ease;
    }

    .bar-tooltip {
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: #2d8cf0);
        font-weight: 500;
        white-space: nowrap;
    }

    .bar-label {
        margin: 8px 0 4px 0;
        font-size: 12px;
        color: #515a6e;
    }

    .bar-count {
        margin: 0;
        font-size: 12px;
        color: #808695;
    }

    .empty-text {
        color: #c5c8ce;
        font-size: 14px;
    }

    .vip-stats {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .vip-item {
        padding: 12px;
        background: #f8f8f9;
        border-radius: 6px;
    }

    .vip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .vip-name {
        font-size: 14px;
        color: #17233d;
        font-weight: 500;
    }

    .vip-count {
        font-size: 14px;
        color: #2d8cf0);
        font-weight: 500;
    }

    .vip-progress {
        width: 100%;
    }

    .progress-bg {
        width: 100%;
        height: 8px;
        background: #e8eaec;
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #2d8cf0, #5cadff);
        border-radius: 4px;
        transition: width 0.5s ease;
    }

    .table-panel {
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .money {
        color: #19be6b;
        font-weight: 600;
    }

    .bar-green {
        background: linear-gradient(180deg, #19be6b, #47cb89);
    }

    .order-stats {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .order-stat-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-radius: 8px;
        background: #f8f8f9;
    }

    .order-stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
    }

    .order-stat-item.success .order-stat-icon {
        background: linear-gradient(135deg, #19be6b, #47cb89);
        color: #fff;
    }

    .order-stat-item.pending .order-stat-icon {
        background: linear-gradient(135deg, #ff9900, #ffb84d);
        color: #fff;
    }

    .order-stat-item.total .order-stat-icon {
        background: linear-gradient(135deg, #2d8cf0, #5cadff);
        color: #fff;
    }

    .order-stat-content {
        flex: 1;
    }

    .order-stat-value {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 600;
        color: #17233d;
    }

    .order-stat-label {
        margin: 0 0 2px 0;
        font-size: 14px;
        color: #515a6e;
    }

    .order-stat-amount {
        margin: 0;
        font-size: 12px;
        color: #808695;
    }

    .platform-stats {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .platform-item {
        padding: 12px;
        background: #f8f8f9;
        border-radius: 6px;
    }

    .platform-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .platform-name {
        font-size: 14px;
        color: #17233d;
        font-weight: 500;
    }

    .platform-count {
        font-size: 14px;
        color: #2d8cf0;
        font-weight: 500;
    }

    .platform-progress {
        width: 100%;
    }

    .recharge-stats {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .recharge-item {
        padding: 12px;
        background: #f8f8f9;
        border-radius: 6px;
    }

    .recharge-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
    }

    .recharge-name {
        font-size: 14px;
        color: #17233d;
        font-weight: 500;
    }

    .recharge-count {
        font-size: 12px;
        color: #808695;
    }

    .recharge-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .recharge-amount {
        font-size: 16px;
        color: #19be6b;
        font-weight: 600;
    }

    .recharge-avg {
        font-size: 12px;
        color: #808695;
    }

    .detail-tabs-panel {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        overflow: hidden;
    }

    .tabs-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        padding: 20px;
        margin-bottom: 0;
    }

    .tabs-header h3 {
        margin: 0;
    }

    .tabs {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
    }

    .tab-item {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        color: #515a6e;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .tab-item:hover {
        background: #f8f8f9;
        color: #2d8cf0;
    }

    .tab-item.active {
        background: #2d8cf0;
        color: #fff;
    }

    .tab-content {
        padding: 0 20px 20px 20px;
    }

    @media (max-width: 1200px) {
        .charts-row {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .stat-cards {
            grid-template-columns: 1fr;
        }

        .tabs-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .tabs {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
        }

        .tab-item {
            flex-shrink: 0;
        }
    }
</style>
