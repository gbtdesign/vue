<template>
  <div class="category-page">
    <el-card shadow="never">
      <div class="toolbar">
        <el-button type="primary" @click="handleAdd()">
          <el-icon><Plus /></el-icon>新增分类
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="treeData"
        row-key="id"
        :default-expand-all="true"
        border
        style="width: 100%"
      >
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="sort" label="排序值" width="120" align="center" />
        <el-table-column label="操作" width="260" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="primary" link size="small" @click="handleAddChild(row)">
              新增子分类
            </el-button>
            <el-popconfirm
              title="确定要删除该分类吗？"
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
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input-number v-model="dialogForm.sort" :min="0" style="width: 180px" />
        </el-form-item>
        <el-form-item label="上级分类">
          <el-select
            v-model="dialogForm.parentId"
            placeholder="无（顶级分类）"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="cat in parentOptions"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getCategoryList } from '@/api/product'
import type { Category } from '@/types/product'

const loading = ref(false)
const categoryList = ref<Category[]>([])

// 构建树形数据
const treeData = computed(() => {
  const map = new Map<number, Category & { children: Category[] }>()
  const roots: (Category & { children: Category[] })[] = []

  categoryList.value.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  categoryList.value.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === 0) {
      roots.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return roots
})

// 上级分类选项（只展示顶级分类）
const parentOptions = computed(() => {
  return categoryList.value.filter((c) => c.parentId === 0)
})

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getCategoryList()
    categoryList.value = res.data
  } finally {
    loading.value = false
  }
}

// 弹窗相关
const dialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()
const isEditMode = ref(false)
const editingId = ref<number | null>(null)

const dialogForm = reactive({
  name: '',
  sort: 1,
  parentId: 0,
})

const dialogRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

const dialogTitle = computed(() => {
  if (isEditMode.value) return '编辑分类'
  return dialogForm.parentId ? '新增子分类' : '新增分类'
})

function handleAdd() {
  isEditMode.value = false
  editingId.value = null
  dialogForm.name = ''
  dialogForm.sort = 1
  dialogForm.parentId = 0
  dialogVisible.value = true
}

function handleAddChild(row: Category) {
  isEditMode.value = false
  editingId.value = null
  dialogForm.name = ''
  dialogForm.sort = 1
  dialogForm.parentId = row.id
  dialogVisible.value = true
}

function handleEdit(row: Category) {
  isEditMode.value = true
  editingId.value = row.id
  dialogForm.name = row.name
  dialogForm.sort = row.sort
  dialogForm.parentId = row.parentId
  dialogVisible.value = true
}

function resetForm() {
  dialogFormRef.value?.resetFields()
}

async function handleDialogConfirm() {
  if (!dialogFormRef.value) return
  await dialogFormRef.value.validate()

  if (isEditMode.value) {
    console.log('编辑分类', editingId.value, { ...dialogForm })
    ElMessage.success('编辑成功')
  } else {
    console.log('新增分类', { ...dialogForm })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(id: number) {
  console.log('删除分类', id)
  ElMessage.success('删除成功')
  fetchData()
}
</script>

<style scoped>
.category-page {
  padding: 0;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
