<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<template>
  <el-menu
    :default-active="route.path"
    :collapse="collapsed"
    :collapse-transition="false"
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
    router
    class="sidebar-menu"
  >
    <el-menu-item index="/dashboard">
      <el-icon><DataLine /></el-icon>
      <template #title>数据看板</template>
    </el-menu-item>

    <el-sub-menu index="products-group">
      <template #title>
        <el-icon><Goods /></el-icon>
        <span>商品管理</span>
      </template>
      <el-menu-item index="/products">商品列表</el-menu-item>
      <el-menu-item index="/products/categories">分类管理</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/orders">
      <el-icon><Document /></el-icon>
      <template #title>订单管理</template>
    </el-menu-item>

    <el-menu-item index="/users">
      <el-icon><User /></el-icon>
      <template #title>用户管理</template>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.sidebar-menu {
  height: 100%;
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 210px;
}
</style>
