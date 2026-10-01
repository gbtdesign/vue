import type { ApiResponse } from '@/types/api'

export interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  todayNewUsers: number
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

export interface SalesData {
  date: string
  amount: number
  orders: number
}

export interface CategorySales {
  name: string
  value: number
}

export interface TopProduct {
  id: number
  name: string
  sales: number
  amount: number
}

// 仪表盘统计数据
export function getDashboardStats(): ApiResponse<DashboardStats> {
  return {
    code: 200,
    message: 'success',
    data: {
      todayOrders: 156,
      todayRevenue: 89600,
      todayNewUsers: 23,
      totalProducts: 1200,
      totalUsers: 8560,
      totalOrders: 45230,
      totalRevenue: 2896000,
      pendingOrders: 32,
    },
  }
}

// 近7天销售数据
export function getSalesData(): ApiResponse<SalesData[]> {
  const data: SalesData[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    data.push({
      date: `${month}-${day}`,
      amount: Math.floor(Math.random() * 50000) + 30000,
      orders: Math.floor(Math.random() * 100) + 80,
    })
  }
  return {
    code: 200,
    message: 'success',
    data,
  }
}

// 分类销售占比
export function getCategorySales(): ApiResponse<CategorySales[]> {
  return {
    code: 200,
    message: 'success',
    data: [
      { name: '手机数码', value: 35 },
      { name: '电脑办公', value: 25 },
      { name: '家用电器', value: 20 },
      { name: '服饰鞋包', value: 12 },
      { name: '食品饮料', value: 8 },
    ],
  }
}

// 热销商品排行
export function getTopProducts(): ApiResponse<TopProduct[]> {
  return {
    code: 200,
    message: 'success',
    data: [
      { id: 1, name: 'iPhone 15 Pro Max', sales: 1250, amount: 12498750 },
      { id: 2, name: '华为 Mate 60 Pro', sales: 980, amount: 6859020 },
      { id: 3, name: 'MacBook Pro 14英寸', sales: 650, amount: 9749350 },
      { id: 4, name: '小米14 Ultra', sales: 820, amount: 4919180 },
      { id: 5, name: '索尼 WH-1000XM5', sales: 1500, amount: 3748500 },
    ],
  }
}
