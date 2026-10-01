import type { Order, OrderStatus } from '@/types/order'
import type { ApiResponse, PageResult } from '@/types/api'

const orderStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
const paymentMethods = ['支付宝', '微信支付', '银行卡', '花呗', '信用卡']
const addresses = [
  '北京市朝阳区建国路88号',
  '上海市浦东新区陆家嘴环路1000号',
  '广州市天河区体育西路103号',
  '深圳市南山区科技园南区',
  '杭州市西湖区文三路269号',
  '成都市武侯区天府大道北段1700号',
  '武汉市洪山区珞喻路1037号',
  '南京市鼓楼区中山北路321号',
]

const productNames = [
  'iPhone 15 Pro Max',
  '华为 Mate 60 Pro',
  '小米14 Ultra',
  'MacBook Pro 14英寸',
  '联想拯救者 Y9000P',
  'iPad Pro 12.9英寸',
  '格力空调 云佳 1.5匹',
  'Nike Air Force 1',
  '索尼 WH-1000XM5',
  '三只松鼠坚果礼盒',
]

function generateOrderNo(): string {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  return `ORD${y}${m}${d}${rand}`
}

const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '冯十二']

const orders: Order[] = Array.from({ length: 15 }, (_, i) => {
  const status = orderStatuses[i % orderStatuses.length]!
  const totalAmount = Math.floor(Math.random() * 10000) + 100
  const freight = totalAmount > 299 ? 0 : 10
  const discount = Math.floor(Math.random() * 50)
  const payAmount = totalAmount + freight - discount
  const date = new Date(2024, 0, 15 + i)
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`

  return {
    id: i + 1,
    orderNo: generateOrderNo(),
    userId: (i % userNames.length) + 1,
    userName: userNames[i % userNames.length]!,
    items: [
      {
        id: 1,
        productId: (i % 10) + 1,
        productName: productNames[i % productNames.length]!,
        productImage: 'https://via.placeholder.com/80x80',
        price: totalAmount,
        quantity: 1,
        subtotal: totalAmount,
      },
    ],
    totalAmount,
    freight,
    discount,
    payAmount,
    status,
    paymentMethod: paymentMethods[i % paymentMethods.length]!,
    address: addresses[i % addresses.length]!,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    remark: i % 3 === 0 ? '请尽快发货' : '',
    createdAt: dateStr,
    updatedAt: dateStr,
  }
})

// 获取订单列表
export function getOrderList(params: {
  page: number
  pageSize: number
  orderNo?: string
  status?: OrderStatus
}): ApiResponse<PageResult<Order>> {
  let filtered = [...orders]
  if (params.orderNo) {
    filtered = filtered.filter((o) => o.orderNo.includes(params.orderNo!))
  }
  if (params.status) {
    filtered = filtered.filter((o) => o.status === params.status)
  }
  const start = (params.page - 1) * params.pageSize
  const list = filtered.slice(start, start + params.pageSize)
  return {
    code: 200,
    message: 'success',
    data: { list, total: filtered.length },
  }
}

// 获取订单详情
export function getOrderDetail(id: number): ApiResponse<Order | null> {
  const order = orders.find((o) => o.id === id) || null
  return {
    code: 200,
    message: 'success',
    data: order,
  }
}
