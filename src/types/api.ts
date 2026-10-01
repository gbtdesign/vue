export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageQuery {
  page: number
  pageSize: number
}

export interface PageResult<T> {
  list: T[]
  total: number
}
