<template>
    <div class="devices-wrap">
        <div class="devices-header">
            <h2>登录设备管理</h2>
            <p class="desc">查看和管理您的登录设备，可远程踢出异常设备</p>
        </div>
        <div class="devices-list">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="devices.length === 0" class="empty">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                </div>
                <p>暂无登录设备记录</p>
            </div>
            <div v-else class="device-cards">
                <div v-for="device in devices" :key="device._id" class="device-card" :class="{ 'current-device': device.isCurrent }">
                    <div class="device-icon">
                        <svg v-if="device.deviceType === 'mobile'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                            <line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                        <svg v-else-if="device.deviceType === 'tablet'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                            <line x1="12" y1="18" x2="12.01" y2="18"/>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                    </div>
                    <div class="device-info">
                        <div class="device-name">
                            {{ device.deviceName || '未知设备' }}
                            <span v-if="device.isCurrent" class="current-badge">当前设备</span>
                        </div>
                        <div class="device-details">
                            <div class="detail-item">
                                <span class="label">浏览器:</span>
                                <span class="value">{{ device.browser || '未知' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">系统:</span>
                                <span class="value">{{ device.os || '未知' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">IP:</span>
                                <span class="value">{{ device.ip || '未知' }}</span>
                            </div>
                            <div class="detail-item" v-if="device.location">
                                <span class="label">位置:</span>
                                <span class="value">{{ device.location }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">登录时间:</span>
                                <span class="value">{{ formatDate(device.createdAt) }}</span>
                            </div>
                            <div class="detail-item" v-if="device.lastActiveAt">
                                <span class="label">最后活跃:</span>
                                <span class="value">{{ formatDate(device.lastActiveAt) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="device-action">
                        <Button 
                            v-if="!device.isCurrent" 
                            type="error" 
                            size="small" 
                            @click="handleKickDevice(device)"
                            :loading="kickingId === device._id"
                        >
                            踢出设备
                        </Button>
                        <span v-else class="current-text">当前登录中</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginDevices",
    data() {
        return {
            devices: [],
            loading: false,
            kickingId: null
        }
    },
    mounted() {
        this.loadDevices()
    },
    methods: {
        async loadDevices() {
            this.loading = true
            try {
                const res = await this.Ajax('getLoginDevices')
                if (res && res.data) {
                    this.devices = res.data
                }
            } catch (e) {
                this.$Message.error('获取设备列表失败')
            } finally {
                this.loading = false
            }
        },
        async handleKickDevice(device) {
            this.$Modal.confirm({
                title: '确认踢出设备',
                content: `确定要踢出设备「${device.deviceName || '未知设备'}」吗？踢出后该设备需要重新登录。`,
                onOk: async () => {
                    this.kickingId = device._id
                    try {
                        const res = await this.Ajax('kickDevice', { deviceId: device._id })
                        if (res && res.data && res.data.success) {
                            this.$Message.success('设备已踢出')
                            this.loadDevices()
                        }
                    } catch (e) {
                        this.$Message.error('踢出设备失败')
                    } finally {
                        this.kickingId = null
                    }
                }
            })
        },
        formatDate(dateStr) {
            if (!dateStr) return ''
            const date = new Date(dateStr)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}`
        }
    }
}
</script>

<style scoped>
.devices-wrap {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

.devices-header {
    margin-bottom: 24px;
    text-align: center;
}

.devices-header h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
}

.devices-header .desc {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
}

.loading, .empty {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: #d1d5db;
}

.empty-icon svg {
    width: 100%;
    height: 100%;
}

.device-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.device-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.2s ease;
    gap: 20px;
}

.device-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
}

.device-card.current-device {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #fff 100%);
}

.device-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 12px;
    color: #4b5563;
    flex-shrink: 0;
}

.current-device .device-icon {
    background: #dbeafe;
    color: #2563eb;
}

.device-icon svg {
    width: 28px;
    height: 28px;
}

.device-info {
    flex: 1;
    min-width: 0;
}

.device-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.current-badge {
    padding: 2px 8px;
    background: #3b82f6;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
}

.device-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px 16px;
}

.detail-item {
    display: flex;
    gap: 6px;
    font-size: 13px;
}

.detail-item .label {
    color: #6b7280;
    flex-shrink: 0;
}

.detail-item .value {
    color: #374151;
    word-break: break-all;
}

.device-action {
    flex-shrink: 0;
}

.current-text {
    color: #3b82f6;
    font-size: 13px;
    font-weight: 500;
}

@media (max-width: 640px) {
    .device-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
    
    .device-action {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
