import request from './request'
import type { ApiResponse, PageResult } from '@/types/api'
import type { User, UserQuery } from '@/types/user'
import * as mockUser from '@/mock/user'

export function getUserList(params: UserQuery): Promise<ApiResponse<PageResult<User>>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser.getUserList(params))
    }, 300)
  })
}

export function getUserDetail(id: number): Promise<ApiResponse<User | null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser.getUserDetail(id))
    }, 200)
  })
}

export function toggleUserStatus(id: number, status: 0 | 1): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, message: 'success', data: null })
    }, 200)
  })
}

export function adjustBalance(id: number, amount: number): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, message: 'success', data: null })
    }, 200)
  })
}

export function adjustPoints(id: number, points: number): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, message: 'success', data: null })
    }, 200)
  })
}
