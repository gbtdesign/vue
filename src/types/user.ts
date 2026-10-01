export type UserLevel = 'normal' | 'silver' | 'gold' | 'vip'

export interface User {
  id: number
  username: string
  avatar: string
  phone: string
  level: UserLevel
  totalSpent: number
  balance: number
  points: number
  status: 0 | 1
  createdAt: string
}

export interface UserQuery {
  keyword?: string
  level?: UserLevel
  dateRange?: [string, string]
  page: number
  pageSize: number
}
