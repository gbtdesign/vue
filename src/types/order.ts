export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  orderNo: string
  userId: number
  userName: string
  items: OrderItem[]
  totalAmount: number
  freight: number
  discount: number
  payAmount: number
  status: OrderStatus
  paymentMethod: string
  address: string
  phone: string
  remark: string
  createdAt: string
  updatedAt: string
}

export interface OrderQuery {
  orderNo?: string
  status?: OrderStatus
  dateRange?: [string, string]
  page: number
  pageSize: number
}
