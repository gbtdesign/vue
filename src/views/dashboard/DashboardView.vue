<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f56c6c, #e6305e)">
              <el-icon :size="28"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ formatNumber(stats?.totalRevenue || 0) }}</div>
              <div class="stat-label">总销售额</div>
              <div class="stat-trend up">
                <el-icon><Top /></el-icon>
                <span>12.5%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #409eff, #2d8cf0)">
              <el-icon :size="28"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(stats?.totalOrders || 0) }}</div>
              <div class="stat-label">订单数</div>
              <div class="stat-trend up">
                <el-icon><Top /></el-icon>
                <span>8.2%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #67c23a, #529b2e)">
              <el-icon :size="28"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(stats?.totalUsers || 0) }}</div>
              <div class="stat-label">用户数</div>
              <div class="stat-trend up">
                <el-icon><Top /></el-icon>
                <span>15.3%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #e6a23c, #c87f1a)">
              <el-icon :size="28"><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(stats?.totalProducts || 0) }}</div>
              <div class="stat-label">商品数</div>
              <div class="stat-trend up">
                <el-icon><Top /></el-icon>
                <span>3.1%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中部图表区 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>近7天销售趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <VChart :option="lineChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>商品分类占比</span>
            </div>
          </template>
          <div class="chart-container">
            <VChart :option="pieChartOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部最近订单 -->
    <el-card shadow="hover" class="orders-card">
      <template #header>
        <div class="card-header">
          <span>最近订单</span>
        </div>
      </template>
      <el-table :data="recentOrders" stripe style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="userName" label="用户" width="100" />
        <el-table-column label="商品摘要" min-width="200">
          <template #default="{ row }">
            {{ row.items?.map((item: OrderItem) => item.productName).join(', ') || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template #default="{ row }">
            ¥{{ formatNumber(row.payAmount) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Money, ShoppingCart, User, Goods, Top } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useDashboardStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'
import type { OrderItem } from '@/types/order'
import type { OrderStatus } from '@/types/order'

use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const dashboardStore = useDashboardStore()
const { stats, salesTrend, categoryDistribution, recentOrders } = storeToRefs(dashboardStore)

// 格式化数字
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 订单状态类型
function getStatusType(status: OrderStatus): '' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<OrderStatus, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'warning',
    paid: '',
    shipped: '',
    completed: 'success',
    cancelled: 'info',
  }
  return map[status]
}

// 订单状态文本
function getStatusText(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status]
}

// 折线图配置
const lineChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const data = params[0]
      return `${data.name}<br/>销售额: ¥${formatNumber(data.value)}`
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: salesTrend.value.map((item) => item.date),
    axisLine: { lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266' },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f2f6fc', type: 'dashed' } },
    axisLabel: { color: '#606266' },
  },
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#409eff' },
      itemStyle: { color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.4)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ],
        },
      },
      data: salesTrend.value.map((item) => item.amount),
    },
  ],
}))

// 饼图配置
const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}%',
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: { color: '#606266' },
  },
  series: [
    {
      name: '分类占比',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      data: categoryDistribution.value.map((item) => ({
        name: item.name,
        value: item.value,
      })),
      color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'],
    },
  ],
}))

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.stat-trend.up {
  color: #f56c6c;
}

.stat-trend.down {
  color: #67c23a;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  height: 350px;
}

.orders-card {
  margin-bottom: 20px;
}

.orders-card :deep(.el-table) {
  --el-table-border-color: #f2f6fc;
}
</style>
