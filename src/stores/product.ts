import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, Category, ProductQuery } from '@/types/product'
import {
  getProductList,
  getCategoryList,
  deleteProduct as deleteProductApi,
} from '@/api/product'

export const useProductStore = defineStore('product', () => {
  const productList = ref<Product[]>([])
  const total = ref(0)
  const categoryList = ref<Category[]>([])
  const loading = ref(false)
  const query = ref<ProductQuery>({ page: 1, pageSize: 10 })

  async function fetchProducts() {
    loading.value = true
    try {
      const res = await getProductList(query.value)
      productList.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    const res = await getCategoryList()
    categoryList.value = res.data
  }

  async function removeProduct(id: number) {
    await deleteProductApi(id)
    await fetchProducts()
  }

  function resetQuery() {
    query.value = { page: 1, pageSize: 10 }
  }

  return {
    productList,
    total,
    categoryList,
    loading,
    query,
    fetchProducts,
    fetchCategories,
    removeProduct,
    resetQuery,
  }
})
