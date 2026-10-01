import type { ApiResponse, PageResult } from '@/types/api'
import type { Order, OrderQuery } from '@/types/order'
import { getOrderList as mockGetOrderList, getOrderDetail as mockGetOrderDetail } from '@/mock/order'

export function getOrderList(params: OrderQuery): Promise<ApiResponse<PageResult<Order>>> {
  return Promise.resolve(mockGetOrderList({
    page: params.page,
    pageSize: params.pageSize,
    orderNo: params.orderNo,
    status: params.status,
  }))
}

export function getOrderDetail(id: number): Promise<ApiResponse<Order | null>> {
  return Promise.resolve(mockGetOrderDetail(id))
}

export function shipOrder(id: number): Promise<ApiResponse<null>> {
  return Promise.resolve({ code: 200, message: '发货成功', data: null })
}

export function cancelOrder(id: number): Promise<ApiResponse<null>> {
  return Promise.resolve({ code: 200, message: '取消成功', data: null })
}
