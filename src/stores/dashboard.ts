import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStats, SalesData, CategorySales } from '@/mock/dashboard'
import type { Order } from '@/types/order'
import {
  getDashboardStatsApi,
  getSalesTrendApi,
  getCategoryDistributionApi,
  getRecentOrdersApi,
} from '@/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats | null>(null)
  const salesTrend = ref<SalesData[]>([])
  const categoryDistribution = ref<CategorySales[]>([])
  const recentOrders = ref<Order[]>([])
  const loading = ref(false)

  async function fetchDashboardData() {
    loading.value = true
    try {
      const [statsRes, salesRes, categoryRes, ordersRes] = await Promise.all([
        getDashboardStatsApi(),
        getSalesTrendApi(),
        getCategoryDistributionApi(),
        getRecentOrdersApi(),
      ])
      stats.value = statsRes.data
      salesTrend.value = salesRes.data
      categoryDistribution.value = categoryRes.data
      recentOrders.value = ordersRes.data.list
    } finally {
      loading.value = false
    }
  }

  return { stats, salesTrend, categoryDistribution, recentOrders, loading, fetchDashboardData }
})
