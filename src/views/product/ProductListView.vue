<template>
  <div class="product-list-page">
    <!-- 搜索筛选栏 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="filterForm" inline>
        <el-form-item label="商品名称">
          <el-input
            v-model="filterForm.name"
            placeholder="请输入商品名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="filterForm.categoryId"
            placeholder="请选择分类"
            clearable
            style="width: 160px"
          >
            <el-option
              v-for="cat in categoryOptions"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 140px"
          >
            <el-option label="全部" :value="undefined" />
            <el-option label="已上架" :value="1" />
            <el-option label="已下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="table-card" shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="router.push('/products/add')">
          <el-icon><Plus /></el-icon>新增商品
        </el-button>
        <el-button
          type="danger"
          :disabled="!selectedIds.length"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>

      <!-- 商品数据表格 -->
      <el-table
        v-loading="store.loading"
        :data="store.productList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="商品图片" width="90" align="center">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              style="width: 60px; height: 60px; border-radius: 6px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类名称" width="120" />
        <el-table-column label="价格" width="120">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="90" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              inline-prompt
              active-text="上"
              inactive-text="下"
              style="margin: 0 8px"
              @change="(val: number) => handleToggleStatus(row, val as 0 | 1)"
            />
            <el-popconfirm
              title="确定要删除该商品吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="store.query.page"
          v-model:page-size="store.query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="store.total"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProductStore } from '@/stores/product'
import { toggleProductStatus, deleteProduct } from '@/api/product'

const router = useRouter()
const store = useProductStore()

const filterForm = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  status: undefined as 0 | 1 | undefined,
})

const selectedIds = ref<number[]>([])

// 分类选项（只取顶级分类用于筛选）
const categoryOptions = computed(() => {
  return store.categoryList.filter((c) => c.parentId === 0)
})

onMounted(() => {
  store.fetchCategories()
  store.fetchProducts()
})

function handleSearch() {
  store.query.page = 1
  store.query.name = filterForm.name || undefined
  store.query.categoryId = filterForm.categoryId
  store.query.status = filterForm.status
  store.fetchProducts()
}

function handleReset() {
  filterForm.name = ''
  filterForm.categoryId = undefined
  filterForm.status = undefined
  store.resetQuery()
  store.fetchProducts()
}

function handleSelectionChange(rows: any[]) {
  selectedIds.value = rows.map((r) => r.id)
}

function handleEdit(row: any) {
  router.push(`/products/${row.id}/edit`)
}

async function handleToggleStatus(row: any, val: 0 | 1) {
  try {
    await toggleProductStatus(row.id, val)
    ElMessage.success(val === 1 ? '已上架' : '已下架')
  } catch {
    row.status = val === 1 ? 0 : 1
  }
}

async function handleDelete(id: number) {
  await deleteProduct(id)
  ElMessage.success('删除成功')
  store.fetchProducts()
}

async function handleBatchDelete() {
  await ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 个商品吗？`,
    '批量删除',
    { type: 'warning' }
  )
  for (const id of selectedIds.value) {
    await deleteProduct(id)
  }
  ElMessage.success('批量删除成功')
  store.fetchProducts()
}

function handleSizeChange() {
  store.query.page = 1
  store.fetchProducts()
}

function handlePageChange() {
  store.fetchProducts()
}
</script>

<style scoped>
.product-list-page {
  padding: 0;
}

.filter-card {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.price-text {
  color: #f56c6c;
  font-weight: 600;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
