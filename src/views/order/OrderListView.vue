<template>
  <div class="order-list-page">
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="订单号">
          <el-input
            v-model="filterForm.orderNo"
            placeholder="请输入订单号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待付款" value="pending" />
            <el-option label="待发货" value="paid" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="orderStore.orderList" v-loading="orderStore.loading" stripe>
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="userName" label="用户信息" min-width="100" />
        <el-table-column label="商品摘要" min-width="180">
          <template #default="{ row }">
            {{ getProductSummary(row) }}
          </template>
        </el-table-column>
        <el-table-column label="总金额" min-width="120">
          <template #default="{ row }">
            <span class="amount">{{ formatPrice(row.payAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" min-width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row.id)">查看详情</el-button>
            <el-button
              v-if="row.status === 'paid'"
              link
              type="primary"
              @click="handleShip(row.id)"
            >发货</el-button>
            <el-button
              v-if="row.status === 'pending' || row.status === 'paid'"
              link
              type="danger"
              @click="handleCancel(row.id)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="orderStore.query.page"
          v-model:page-size="orderStore.query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="orderStore.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/order'
import { formatPrice, formatDate } from '@/utils/format'
import type { Order, OrderStatus } from '@/types/order'

const router = useRouter()
const orderStore = useOrderStore()

const filterForm = reactive({
  orderNo: '',
  status: '' as OrderStatus | '',
  dateRange: null as [string, string] | null,
})

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

function getProductSummary(row: Order) {
  if (!row.items || row.items.length === 0) return '无商品'
  const first = row.items[0]!.productName
  if (row.items.length > 1) {
    return `${first} 等${row.items.length}件商品`
  }
  return first
}

function handleSearch() {
  orderStore.query.page = 1
  orderStore.query.orderNo = filterForm.orderNo || undefined
  orderStore.query.status = (filterForm.status || undefined) as OrderStatus | undefined
  orderStore.fetchOrders()
}

function handleReset() {
  filterForm.orderNo = ''
  filterForm.status = ''
  filterForm.dateRange = null
  orderStore.query = { page: 1, pageSize: 10 }
  orderStore.fetchOrders()
}

function handleSizeChange() {
  orderStore.query.page = 1
  orderStore.fetchOrders()
}

function handlePageChange() {
  orderStore.fetchOrders()
}

function handleDetail(id: number) {
  router.push(`/orders/${id}`)
}

async function handleShip(id: number) {
  await ElMessageBox.confirm('确认发货吗？', '提示', { type: 'warning' })
  await orderStore.shipOrder(id)
  ElMessage.success('发货成功')
  orderStore.fetchOrders()
}

async function handleCancel(id: number) {
  await ElMessageBox.confirm('确认取消该订单吗？', '提示', { type: 'warning' })
  await orderStore.cancelOrder(id)
  ElMessage.success('取消成功')
  orderStore.fetchOrders()
}

onMounted(() => {
  orderStore.fetchOrders()
})
</script>

<style scoped>
.order-list-page {
  padding: 0;
}

.filter-card {
  margin-bottom: 16px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.table-card {
  margin-bottom: 16px;
}

.amount {
  color: #f56c6c;
  font-weight: 700;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
