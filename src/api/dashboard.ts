import type { ApiResponse } from '@/types/api'
import type { Order } from '@/types/order'
import {
  getDashboardStats as mockGetDashboardStats,
  getSalesData as mockGetSalesData,
  getCategorySales as mockGetCategorySales,
} from '@/mock/dashboard'
import { getOrderList } from '@/mock/order'
import type { DashboardStats, SalesData, CategorySales } from '@/mock/dashboard'

// 目前使用 mock 数据，后续可切换为真实 API
export function getDashboardStatsApi(): Promise<ApiResponse<DashboardStats>> {
  return Promise.resolve(mockGetDashboardStats())
}

export function getSalesTrendApi(): Promise<ApiResponse<SalesData[]>> {
  return Promise.resolve(mockGetSalesData())
}

export function getCategoryDistributionApi(): Promise<ApiResponse<CategorySales[]>> {
  return Promise.resolve(mockGetCategorySales())
}

export function getRecentOrdersApi(): Promise<ApiResponse<{ list: Order[]; total: number }>> {
  return Promise.resolve(getOrderList({ page: 1, pageSize: 5 }))
}
