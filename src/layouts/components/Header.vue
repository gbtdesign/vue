<script setup lang="ts">
import { useRouter } from 'vue-router'
import { removeToken } from '@/utils/auth'

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const router = useRouter()

function handleLogout() {
  removeToken()
  router.push('/login')
}
</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <el-icon class="hamburger" @click="emit('toggle-sidebar')">
        <Fold />
      </el-icon>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="30" icon="UserFilled" />
          <span class="username">管理员</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.hamburger {
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.hamburger:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #333;
}
</style>
