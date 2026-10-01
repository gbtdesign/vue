<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <el-container class="admin-layout">
    <el-aside :width="collapsed ? '64px' : '210px'" class="sidebar">
      <div class="logo">
        <span v-show="!collapsed">电商后台管理系统</span>
        <span v-show="collapsed">电商</span>
      </div>
      <Sidebar :collapsed="collapsed" />
    </el-aside>
    <el-container class="main-container">
      <el-header class="header" height="50px">
        <Header @toggle-sidebar="toggleSidebar" />
      </el-header>
      <el-main class="main-content">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-layout {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  overflow: hidden;
  transition: width 0.3s;
}

.logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  background-color: #263445;
  white-space: nowrap;
  overflow: hidden;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.main-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  background-color: #f0f2f5;
  padding: 16px;
  overflow-y: auto;
}
</style>
