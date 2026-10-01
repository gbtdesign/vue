<template>
  <div class="user-list-page">
    <!-- 搜索筛选栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="用户名/手机号"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="searchForm.level" placeholder="全部" clearable style="width: 150px">
            <el-option label="普通会员" value="normal" />
            <el-option label="白银会员" value="silver" />
            <el-option label="黄金会员" value="gold" />
            <el-option label="VIP会员" value="vip" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="userStore.userList" v-loading="userStore.loading" stripe>
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" shape="circle">
              {{ row.username.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column label="会员等级" min-width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="levelTagType(row.level)">{{ levelLabel(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="累计消费" min-width="120" align="right">
          <template #default="{ row }">
            {{ formatPrice(row.totalSpent) }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row.id)">查看详情</el-button>
            <el-button
              :type="row.status === 1 ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="userStore.query.page"
          v-model:page-size="userStore.query.pageSize"
          :total="userStore.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { User, UserLevel } from '@/types/user'
import { formatDate, formatPrice } from '@/utils/format'

const router = useRouter()
const userStore = useUserStore()

const searchForm = reactive<{
  keyword: string
  level: UserLevel | ''
  dateRange: [string, string] | null
}>({
  keyword: '',
  level: '',
  dateRange: null,
})

function levelTagType(level: UserLevel) {
  const map: Record<UserLevel, string> = {
    normal: 'info',
    silver: '',
    gold: 'warning',
    vip: 'danger',
  }
  return map[level]
}

function levelLabel(level: UserLevel) {
  const map: Record<UserLevel, string> = {
    normal: '普通会员',
    silver: '白银会员',
    gold: '黄金会员',
    vip: 'VIP会员',
  }
  return map[level]
}

function buildQuery() {
  userStore.query.page = 1
  userStore.query.keyword = searchForm.keyword || undefined
  userStore.query.level = (searchForm.level as UserLevel) || undefined
  userStore.query.dateRange = searchForm.dateRange || undefined
}

function handleSearch() {
  buildQuery()
  userStore.fetchUsers()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.level = ''
  searchForm.dateRange = null
  buildQuery()
  userStore.fetchUsers()
}

function handleSizeChange() {
  userStore.query.page = 1
  userStore.fetchUsers()
}

function handlePageChange() {
  userStore.fetchUsers()
}

function handleViewDetail(id: number) {
  router.push(`/users/${id}`)
}

function handleToggleStatus(row: User) {
  const action = row.status === 1 ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}用户「${row.username}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.toggleUserStatus(row.id, row.status === 1 ? 0 : 1)
  }).catch(() => {})
}

onMounted(() => {
  userStore.fetchUsers()
})
</script>

<style scoped>
.user-list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-card :deep(.el-form-item) {
  margin-bottom: 0;
}

.table-card {
  margin-top: 0;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
