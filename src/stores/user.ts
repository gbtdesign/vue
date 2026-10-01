import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserQuery } from '@/types/user'
import * as userApi from '@/api/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user-manage', () => {
  const userList = ref<User[]>([])
  const total = ref(0)
  const loading = ref(false)
  const query = ref<UserQuery>({ page: 1, pageSize: 10 })
  const currentUser = ref<User | null>(null)

  async function fetchUsers() {
    loading.value = true
    try {
      const res = await userApi.getUserList(query.value)
      userList.value = res.data.list
      total.value = res.data.total
    } catch (e) {
      ElMessage.error('获取用户列表失败')
    } finally {
      loading.value = false
    }
  }

  async function fetchUserDetail(id: number) {
    loading.value = true
    try {
      const res = await userApi.getUserDetail(id)
      currentUser.value = res.data
    } catch (e) {
      ElMessage.error('获取用户详情失败')
    } finally {
      loading.value = false
    }
  }

  async function toggleUserStatus(id: number, status: 0 | 1) {
    try {
      await userApi.toggleUserStatus(id, status)
      ElMessage.success(status === 1 ? '已启用' : '已禁用')
      const user = userList.value.find((u) => u.id === id)
      if (user) user.status = status
      if (currentUser.value?.id === id) currentUser.value.status = status
    } catch (e) {
      ElMessage.error('操作失败')
    }
  }

  return { userList, total, loading, query, currentUser, fetchUsers, fetchUserDetail, toggleUserStatus }
})
