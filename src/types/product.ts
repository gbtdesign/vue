export interface Product {
  id: number
  name: string
  categoryId: number
  categoryName: string
  price: number
  stock: number
  image: string
  description: string
  status: 0 | 1
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  parentId: number
  children?: Category[]
  sort: number
}

export interface ProductQuery {
  name?: string
  categoryId?: number
  status?: 0 | 1
  page: number
  pageSize: number
}
