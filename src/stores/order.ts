import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, OrderQuery } from '@/types/order'
import { getOrderList, getOrderDetail, shipOrder as shipOrderApi, cancelOrder as cancelOrderApi } from '@/api/order'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref<Order[]>([])
  const total = ref(0)
  const loading = ref(false)
  const query = ref<OrderQuery>({ page: 1, pageSize: 10 })
  const currentOrder = ref<Order | null>(null)

  async function fetchOrders() {
    loading.value = true
    try {
      const res = await getOrderList(query.value)
      orderList.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderDetail(id: number) {
    loading.value = true
    try {
      const res = await getOrderDetail(id)
      currentOrder.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function shipOrder(id: number) {
    await shipOrderApi(id)
  }

  async function cancelOrder(id: number) {
    await cancelOrderApi(id)
  }

  return { orderList, total, loading, query, currentOrder, fetchOrders, fetchOrderDetail, shipOrder, cancelOrder }
})
