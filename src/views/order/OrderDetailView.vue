<template>
  <div class="order-detail-page" v-loading="orderStore.loading">
    <template v-if="order">
      <!-- 订单基本信息 -->
      <el-card shadow="never" class="detail-card">
        <template #header>
          <span class="card-title">订单信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ formatDate(order.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ order.paymentMethod }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="statusTagType(order.status)">{{ statusLabel(order.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 用户信息 -->
      <el-card shadow="never" class="detail-card">
        <template #header>
          <span class="card-title">用户信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ order.userName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ order.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ order.address }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 商品清单 -->
      <el-card shadow="never" class="detail-card">
        <template #header>
          <span class="card-title">商品清单</span>
        </template>
        <el-table :data="order.items" stripe>
          <el-table-column label="商品图片" width="100">
            <template #default="{ row }">
              <el-image
                :src="row.productImage"
                :fit="'cover'"
                style="width: 60px; height: 60px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" min-width="200" />
          <el-table-column label="单价" width="120">
            <template #default="{ row }">
              {{ formatPrice(row.price) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              {{ formatPrice(row.subtotal) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 金额汇总 -->
        <div class="amount-summary">
          <div class="summary-row">
            <span>商品总额：</span>
            <span>{{ formatPrice(order.totalAmount) }}</span>
          </div>
          <div class="summary-row">
            <span>运费：</span>
            <span>{{ formatPrice(order.freight) }}</span>
          </div>
          <div class="summary-row">
            <span>优惠金额：</span>
            <span>-{{ formatPrice(order.discount) }}</span>
          </div>
          <div class="summary-row total-row">
            <span>实付金额：</span>
            <span class="pay-amount">{{ formatPrice(order.payAmount) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 物流信息时间线 -->
      <el-card shadow="never" class="detail-card">
        <template #header>
          <span class="card-title">物流信息</span>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(node, index) in timelineNodes"
            :key="index"
            :timestamp="node.time"
            :type="node.type"
            placement="top"
          >
            {{ node.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <el-button @click="handleBack">返回列表</el-button>
        <el-button
          v-if="order.status === 'pending' || order.status === 'paid'"
          type="danger"
          @click="handleCancel"
        >取消订单</el-button>
        <el-button
          v-if="order.status === 'paid'"
          type="primary"
          @click="handleShip"
        >发货</el-button>
      </div>
    </template>

    <el-empty v-else description="订单不存在" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/order'
import { formatPrice, formatDate } from '@/utils/format'
import type { OrderStatus } from '@/types/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)

const statusMap: Record<OrderStatus, string> = {
  pending: '待付款',
  paid: '待发货',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
}

const statusTagMap: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'danger'> = {
  pending: 'warning',
  paid: 'info',
  shipped: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

function statusLabel(status: OrderStatus) {
  return statusMap[status] || status
}

function statusTagType(status: OrderStatus) {
  return statusTagMap[status] || 'info'
}

interface TimelineNode {
  time: string
  content: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
}

const timelineNodes = computed<TimelineNode[]>(() => {
  if (!order.value) return []
  const createdAt = formatDate(order.value.createdAt)
  const nodes: TimelineNode[] = [
    { time: createdAt, content: '订单已提交', type: 'success' },
  ]

  const status = order.value.status
  if (status === 'cancelled') {
    nodes.push({ time: createdAt, content: '订单已取消', type: 'danger' })
    return nodes
  }

  if (status === 'pending') {
    nodes.push({ time: '', content: '等待付款中...', type: 'warning' })
    return nodes
  }

  // paid, shipped, completed all have payment step
  nodes.push({ time: createdAt, content: '已付款', type: 'success' })

  if (status === 'paid') {
    nodes.push({ time: '', content: '等待发货中...', type: 'warning' })
    return nodes
  }

  // shipped, completed
  nodes.push({ time: createdAt, content: '已发货', type: 'primary' })
  nodes.push({ time: createdAt, content: '运输中', type: 'primary' })

  if (status === 'shipped') {
    nodes.push({ time: '', content: '等待签收...', type: 'warning' })
    return nodes
  }

  // completed
  nodes.push({ time: createdAt, content: '已签收，订单完成', type: 'success' })

  return nodes
})

async function handleShip() {
  await ElMessageBox.confirm('确认发货吗？', '提示', { type: 'warning' })
  await orderStore.shipOrder(order.value!.id)
  ElMessage.success('发货成功')
  orderStore.fetchOrderDetail(order.value!.id)
}

async function handleCancel() {
  await ElMessageBox.confirm('确认取消该订单吗？', '提示', { type: 'warning' })
  await orderStore.cancelOrder(order.value!.id)
  ElMessage.success('取消成功')
  orderStore.fetchOrderDetail(order.value!.id)
}

function handleBack() {
  router.push('/orders')
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) {
    orderStore.fetchOrderDetail(id)
  }
})
</script>

<style scoped>
.order-detail-page {
  padding: 0;
}

.detail-card {
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.amount-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px 16px 4px;
}

.summary-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
  min-width: 220px;
}

.summary-row span:first-child {
  color: #909399;
  margin-right: 12px;
}

.total-row {
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
  margin-top: 4px;
}

.pay-amount {
  font-size: 22px;
  font-weight: 700;
  color: #f56c6c;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
}
</style>
