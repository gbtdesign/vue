import type { User, UserLevel } from '@/types/user'
import type { ApiResponse, PageResult } from '@/types/api'

const levels: UserLevel[] = ['normal', 'silver', 'gold', 'vip']

const users: User[] = [
  {
    id: 1,
    username: '张三',
    avatar: 'https://via.placeholder.com/80x80?text=ZS',
    phone: '13800000001',
    level: 'vip',
    totalSpent: 58999,
    balance: 2300,
    points: 12800,
    status: 1,
    createdAt: '2023-06-15 10:00:00',
  },
  {
    id: 2,
    username: '李四',
    avatar: 'https://via.placeholder.com/80x80?text=LS',
    phone: '13800000002',
    level: 'gold',
    totalSpent: 32500,
    balance: 800,
    points: 7600,
    status: 1,
    createdAt: '2023-07-20 10:00:00',
  },
  {
    id: 3,
    username: '王五',
    avatar: 'https://via.placeholder.com/80x80?text=WW',
    phone: '13800000003',
    level: 'silver',
    totalSpent: 15800,
    balance: 450,
    points: 3200,
    status: 1,
    createdAt: '2023-08-10 10:00:00',
  },
  {
    id: 4,
    username: '赵六',
    avatar: 'https://via.placeholder.com/80x80?text=ZL',
    phone: '13800000004',
    level: 'normal',
    totalSpent: 5600,
    balance: 200,
    points: 1100,
    status: 1,
    createdAt: '2023-09-01 10:00:00',
  },
  {
    id: 5,
    username: '钱七',
    avatar: 'https://via.placeholder.com/80x80?text=QQ',
    phone: '13800000005',
    level: 'gold',
    totalSpent: 28900,
    balance: 1500,
    points: 6500,
    status: 1,
    createdAt: '2023-09-15 10:00:00',
  },
  {
    id: 6,
    username: '孙八',
    avatar: 'https://via.placeholder.com/80x80?text=SB',
    phone: '13800000006',
    level: 'normal',
    totalSpent: 3200,
    balance: 100,
    points: 640,
    status: 0,
    createdAt: '2023-10-01 10:00:00',
  },
  {
    id: 7,
    username: '周九',
    avatar: 'https://via.placeholder.com/80x80?text=ZJ',
    phone: '13800000007',
    level: 'silver',
    totalSpent: 18700,
    balance: 600,
    points: 4100,
    status: 1,
    createdAt: '2023-10-20 10:00:00',
  },
  {
    id: 8,
    username: '吴十',
    avatar: 'https://via.placeholder.com/80x80?text=WS',
    phone: '13800000008',
    level: 'vip',
    totalSpent: 72000,
    balance: 5000,
    points: 18000,
    status: 1,
    createdAt: '2023-11-05 10:00:00',
  },
  {
    id: 9,
    username: '郑十一',
    avatar: 'https://via.placeholder.com/80x80?text=Z11',
    phone: '13800000009',
    level: 'normal',
    totalSpent: 1200,
    balance: 50,
    points: 240,
    status: 1,
    createdAt: '2023-11-20 10:00:00',
  },
  {
    id: 10,
    username: '冯十二',
    avatar: 'https://via.placeholder.com/80x80?text=F12',
    phone: '13800000010',
    level: 'gold',
    totalSpent: 41000,
    balance: 3200,
    points: 9500,
    status: 1,
    createdAt: '2023-12-01 10:00:00',
  },
  {
    id: 11,
    username: '陈十三',
    avatar: 'https://via.placeholder.com/80x80?text=C13',
    phone: '13800000011',
    level: 'silver',
    totalSpent: 22300,
    balance: 900,
    points: 5000,
    status: 1,
    createdAt: '2024-01-05 10:00:00',
  },
  {
    id: 12,
    username: '褚十四',
    avatar: 'https://via.placeholder.com/80x80?text=Z14',
    phone: '13800000012',
    level: 'normal',
    totalSpent: 8900,
    balance: 300,
    points: 1780,
    status: 0,
    createdAt: '2024-01-15 10:00:00',
  },
]

// 获取用户列表
export function getUserList(params: {
  page: number
  pageSize: number
  keyword?: string
  level?: UserLevel
}): ApiResponse<PageResult<User>> {
  let filtered = [...users]
  if (params.keyword) {
    filtered = filtered.filter(
      (u) => u.username.includes(params.keyword!) || u.phone.includes(params.keyword!),
    )
  }
  if (params.level) {
    filtered = filtered.filter((u) => u.level === params.level)
  }
  const start = (params.page - 1) * params.pageSize
  const list = filtered.slice(start, start + params.pageSize)
  return {
    code: 200,
    message: 'success',
    data: { list, total: filtered.length },
  }
}

// 获取用户详情
export function getUserDetail(id: number): ApiResponse<User | null> {
  const user = users.find((u) => u.id === id) || null
  return {
    code: 200,
    message: 'success',
    data: user,
  }
}
