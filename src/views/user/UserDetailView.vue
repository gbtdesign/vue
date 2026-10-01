<template>
  <div class="user-detail-page" v-loading="userStore.loading">
    <template v-if="userStore.currentUser">
      <!-- 用户基本信息卡片 -->
      <el-card shadow="never" class="user-info-card">
        <div class="user-info-content">
          <el-avatar :size="100" :src="userStore.currentUser.avatar" shape="circle">
            {{ userStore.currentUser.username.charAt(0) }}
          </el-avatar>
          <el-descriptions :column="2" border class="user-desc">
            <el-descriptions-item label="用户名">{{ userStore.currentUser.username }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userStore.currentUser.phone }}</el-descriptions-item>
            <el-descriptions-item label="会员等级">
              <el-tag :type="levelTagType(userStore.currentUser.level)">
                {{ levelLabel(userStore.currentUser.level) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">
              {{ formatDate(userStore.currentUser.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="账户状态">
              <el-tag :type="userStore.currentUser.status === 1 ? 'success' : 'danger'">
                {{ userStore.currentUser.status === 1 ? '正常' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>

      <!-- Tab 切换区域 -->
      <el-card shadow="never">
        <el-tabs v-model="activeTab">
          <!-- Tab 1 - 订单记录 -->
          <el-tab-pane label="订单记录" name="orders">
            <el-table :data="userOrders" stripe>
              <el-table-column prop="orderNo" label="订单号" min-width="180" />
              <el-table-column label="商品摘要" min-width="200">
                <template #default="{ row }">
                  {{ row.items.map((i: any) => i.productName).join('、') }}
                </template>
              </el-table-column>
              <el-table-column label="金额" min-width="110" align="right">
                <template #default="{ row }">
                  {{ formatPrice(row.payAmount) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="orderStatusType(row.status)">{{ orderStatusLabel(row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="下单时间" min-width="170">
                <template #default="{ row }">
                  {{ formatDate(row.createdAt) }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- Tab 2 - 账户信息 -->
          <el-tab-pane label="账户信息" name="account">
            <div class="account-info">
              <div class="account-item">
                <div class="account-label">账户余额</div>
                <div class="account-value">{{ formatPrice(userStore.currentUser.balance) }}</div>
              </div>
              <div class="account-item">
                <div class="account-label">积分</div>
                <div class="account-value">{{ userStore.currentUser.points }}</div>
              </div>
              <div class="account-item">
                <div class="account-label">累计消费</div>
                <div class="account-value">{{ formatPrice(userStore.currentUser.totalSpent) }}</div>
              </div>
            </div>
            <div class="account-actions">
              <el-button type="primary" @click="showBalanceDialog = true">调整余额</el-button>
              <el-button type="warning" @click="showPointsDialog = true">调整积分</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </template>

    <!-- 调整余额弹窗 -->
    <el-dialog v-model="showBalanceDialog" title="调整余额" width="400px">
      <el-form :model="balanceForm" label-width="80px">
        <el-form-item label="当前余额">
          <span>{{ formatPrice(userStore.currentUser?.balance || 0) }}</span>
        </el-form-item>
        <el-form-item label="调整金额">
          <el-input-number v-model="balanceForm.amount" :precision="2" :step="100" style="width: 100%" />
        </el-form-item>
        <el-form-item>
          <span class="tip">正数增加余额，负数扣减余额</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBalanceDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdjustBalance">确定</el-button>
      </template>
    </el-dialog>

    <!-- 调整积分弹窗 -->
    <el-dialog v-model="showPointsDialog" title="调整积分" width="400px">
      <el-form :model="pointsForm" label-width="80px">
        <el-form-item label="当前积分">
          <span>{{ userStore.currentUser?.points || 0 }}</span>
        </el-form-item>
        <el-form-item label="调整积分">
          <el-input-number v-model="pointsForm.points" :step="100" style="width: 100%" />
        </el-form-item>
        <el-form-item>
          <span class="tip">正数增加积分，负数扣减积分</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPointsDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdjustPoints">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import * as userApi from '@/api/user'
import type { UserLevel } from '@/types/user'
import { formatDate, formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('orders')
const showBalanceDialog = ref(false)
const showPointsDialog = ref(false)

const balanceForm = reactive({ amount: 0 })
const pointsForm = reactive({ points: 0 })

// 模拟用户订单数据
const mockUserOrders = [
  {
    orderNo: 'ORD20240115001234',
    items: [{ productName: 'iPhone 15 Pro Max' }],
    payAmount: 9999,
    status: 'completed',
    createdAt: '2024-01-15 14:30:00',
  },
  {
    orderNo: 'ORD20240120005678',
    items: [{ productName: '华为 Mate 60 Pro' }],
    payAmount: 6999,
    status: 'shipped',
    createdAt: '2024-01-20 10:20:00',
  },
  {
    orderNo: 'ORD20240201009876',
    items: [{ productName: 'MacBook Pro 14英寸' }],
    payAmount: 14999,
    status: 'paid',
    createdAt: '2024-02-01 09:15:00',
  },
  {
    orderNo: 'ORD20240210003456',
    items: [{ productName: '索尼 WH-1000XM5' }],
    payAmount: 2499,
    status: 'pending',
    createdAt: '2024-02-10 16:45:00',
  },
  {
    orderNo: 'ORD20240220007890',
    items: [{ productName: 'Nike Air Force 1' }],
    payAmount: 799,
    status: 'completed',
    createdAt: '2024-02-20 11:00:00',
  },
]

const userOrders = computed(() => mockUserOrders)

function levelTagType(level: UserLevel) {
  const map: Record<UserLevel, string> = {
    normal: 'info',
    silver: '',
    gold: 'warning',
    vip: 'danger',
  }
  return map[level]
}

function levelLabel(level: UserLevel) {
  const map: Record<UserLevel, string> = {
    normal: '普通会员',
    silver: '白银会员',
    gold: '黄金会员',
    vip: 'VIP会员',
  }
  return map[level]
}

function orderStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'info',
    paid: 'warning',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger',
  }
  return map[status] || ''
}

function orderStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

async function handleAdjustBalance() {
  if (!userStore.currentUser) return
  const id = userStore.currentUser.id
  try {
    await userApi.adjustBalance(id, balanceForm.amount)
    ElMessage.success('余额调整成功')
    showBalanceDialog.value = false
    userStore.fetchUserDetail(id)
  } catch (e) {
    ElMessage.error('调整失败')
  }
}

async function handleAdjustPoints() {
  if (!userStore.currentUser) return
  const id = userStore.currentUser.id
  try {
    await userApi.adjustPoints(id, pointsForm.points)
    ElMessage.success('积分调整成功')
    showPointsDialog.value = false
    userStore.fetchUserDetail(id)
  } catch (e) {
    ElMessage.error('调整失败')
  }
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) {
    userStore.fetchUserDetail(id)
  }
})
</script>

<style scoped>
.user-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info-content {
  display: flex;
  align-items: center;
  gap: 32px;
}

.user-desc {
  flex: 1;
}

.account-info {
  display: flex;
  gap: 48px;
  padding: 24px 0;
}

.account-item {
  text-align: center;
}

.account-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.account-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.account-actions {
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.tip {
  font-size: 12px;
  color: #909399;
}
</style>
