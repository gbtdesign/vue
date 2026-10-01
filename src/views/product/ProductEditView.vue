<template>
  <div class="product-edit-page">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑商品' : '新增商品' }}</h2>
    </div>

    <el-card shadow="never">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        style="max-width: 700px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择商品分类">
            <el-option
              v-for="cat in store.categoryList"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0"
            :precision="2"
            :step="1"
            style="width: 220px"
          />
        </el-form-item>

        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="formData.stock"
            :min="0"
            :step="1"
            style="width: 220px"
          />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="router.push('/products')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { useProductStore } from '@/stores/product'
import { getProductDetail, createProduct, updateProduct } from '@/api/product'

const route = useRoute()
const router = useRouter()
const store = useProductStore()

const formRef = ref<FormInstance>()
const fileList = ref<UploadFile[]>([])

const isEdit = computed(() => !!route.params.id)
const productId = computed(() => Number(route.params.id))

const formData = reactive({
  name: '',
  categoryId: undefined as number | undefined,
  price: 0,
  stock: 0,
  description: '',
  image: '',
  status: 1 as 0 | 1,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
}

onMounted(async () => {
  await store.fetchCategories()
  if (isEdit.value) {
    const res = await getProductDetail(productId.value)
    if (res.data) {
      const p = res.data
      formData.name = p.name
      formData.categoryId = p.categoryId
      formData.price = p.price
      formData.stock = p.stock
      formData.description = p.description
      formData.image = p.image
      formData.status = p.status
      if (p.image) {
        fileList.value = [{ name: 'image', url: p.image } as UploadFile]
      }
    }
  }
})

function handleImageChange(file: UploadFile) {
  // 模拟上传，使用本地 URL
  if (file.raw) {
    formData.image = URL.createObjectURL(file.raw)
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate()

  const data = { ...formData }
  if (isEdit.value) {
    await updateProduct(productId.value, data)
    ElMessage.success('编辑成功')
  } else {
    await createProduct(data)
    ElMessage.success('新增成功')
  }
  router.push('/products')
}
</script>

<style scoped>
.product-edit-page {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}
</style>
