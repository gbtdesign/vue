import * as mock from '@/mock/product'
import type { ApiResponse, PageResult } from '@/types/api'
import type { Product, Category, ProductQuery } from '@/types/product'

// 目前使用 mock 数据，后续可切换真实 API
export function getProductList(params: ProductQuery): Promise<ApiResponse<PageResult<Product>>> {
  return Promise.resolve(mock.getProductList(params))
}

export function getProductDetail(id: number): Promise<ApiResponse<Product | null>> {
  return Promise.resolve(mock.getProductDetail(id))
}

export function createProduct(data: Partial<Product>): Promise<ApiResponse<null>> {
  console.log('createProduct', data)
  return Promise.resolve({ code: 200, message: 'success', data: null })
}

export function updateProduct(id: number, data: Partial<Product>): Promise<ApiResponse<null>> {
  console.log('updateProduct', id, data)
  return Promise.resolve({ code: 200, message: 'success', data: null })
}

export function deleteProduct(id: number): Promise<ApiResponse<null>> {
  console.log('deleteProduct', id)
  return Promise.resolve({ code: 200, message: 'success', data: null })
}

export function toggleProductStatus(id: number, status: 0 | 1): Promise<ApiResponse<null>> {
  console.log('toggleProductStatus', id, status)
  return Promise.resolve({ code: 200, message: 'success', data: null })
}

export function getCategoryList(): Promise<ApiResponse<Category[]>> {
  return Promise.resolve(mock.getCategoryList())
}
