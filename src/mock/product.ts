import type { Product, Category } from '@/types/product'
import type { ApiResponse, PageResult } from '@/types/api'

// 分类数据
const categories: Category[] = [
  { id: 1, name: '手机数码', parentId: 0, sort: 1 },
  { id: 2, name: '电脑办公', parentId: 0, sort: 2 },
  { id: 3, name: '家用电器', parentId: 0, sort: 3 },
  { id: 4, name: '服饰鞋包', parentId: 0, sort: 4 },
  { id: 5, name: '食品饮料', parentId: 0, sort: 5 },
  { id: 6, name: '智能手机', parentId: 1, sort: 1 },
  { id: 7, name: '平板电脑', parentId: 1, sort: 2 },
  { id: 8, name: '笔记本', parentId: 2, sort: 1 },
  { id: 9, name: '台式机', parentId: 2, sort: 2 },
  { id: 10, name: '空调', parentId: 3, sort: 1 },
]

// 商品数据
const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    categoryId: 6,
    categoryName: '智能手机',
    price: 9999,
    stock: 500,
    image: 'https://via.placeholder.com/300x300?text=iPhone15',
    description: '苹果最新旗舰手机，A17 Pro芯片，钛金属边框',
    status: 1,
    createdAt: '2024-01-15 10:00:00',
    updatedAt: '2024-01-15 10:00:00',
  },
  {
    id: 2,
    name: '华为 Mate 60 Pro',
    categoryId: 6,
    categoryName: '智能手机',
    price: 6999,
    stock: 300,
    image: 'https://via.placeholder.com/300x300?text=Mate60',
    description: '华为旗舰手机，麒麟9000S芯片，卫星通话',
    status: 1,
    createdAt: '2024-01-16 10:00:00',
    updatedAt: '2024-01-16 10:00:00',
  },
  {
    id: 3,
    name: '小米14 Ultra',
    categoryId: 6,
    categoryName: '智能手机',
    price: 5999,
    stock: 450,
    image: 'https://via.placeholder.com/300x300?text=Mi14',
    description: '小米旗舰，徕卡影像，骁龙8 Gen3',
    status: 1,
    createdAt: '2024-02-01 10:00:00',
    updatedAt: '2024-02-01 10:00:00',
  },
  {
    id: 4,
    name: 'MacBook Pro 14英寸 M3',
    categoryId: 8,
    categoryName: '笔记本',
    price: 14999,
    stock: 200,
    image: 'https://via.placeholder.com/300x300?text=MacBook',
    description: 'Apple M3芯片，18GB内存，512GB存储',
    status: 1,
    createdAt: '2024-01-20 10:00:00',
    updatedAt: '2024-01-20 10:00:00',
  },
  {
    id: 5,
    name: '联想拯救者 Y9000P 2024',
    categoryId: 8,
    categoryName: '笔记本',
    price: 8999,
    stock: 150,
    image: 'https://via.placeholder.com/300x300?text=Y9000P',
    description: 'i9-14900HX，RTX 4060，16GB，1TB',
    status: 1,
    createdAt: '2024-02-05 10:00:00',
    updatedAt: '2024-02-05 10:00:00',
  },
  {
    id: 6,
    name: 'iPad Pro 12.9英寸 M2',
    categoryId: 7,
    categoryName: '平板电脑',
    price: 8999,
    stock: 180,
    image: 'https://via.placeholder.com/300x300?text=iPadPro',
    description: 'M2芯片，Liquid Retina XDR显示屏',
    status: 1,
    createdAt: '2024-01-25 10:00:00',
    updatedAt: '2024-01-25 10:00:00',
  },
  {
    id: 7,
    name: '格力空调 云佳 1.5匹',
    categoryId: 10,
    categoryName: '空调',
    price: 3299,
    stock: 600,
    image: 'https://via.placeholder.com/300x300?text=GreeAC',
    description: '新一级能效，变频冷暖，智能控制',
    status: 1,
    createdAt: '2024-03-01 10:00:00',
    updatedAt: '2024-03-01 10:00:00',
  },
  {
    id: 8,
    name: '美的空调 风酷 3匹',
    categoryId: 10,
    categoryName: '空调',
    price: 6599,
    stock: 250,
    image: 'https://via.placeholder.com/300x300?text=MideaAC',
    description: '新一级能效，变频冷暖，柜机',
    status: 1,
    createdAt: '2024-03-05 10:00:00',
    updatedAt: '2024-03-05 10:00:00',
  },
  {
    id: 9,
    name: 'Nike Air Force 1 白色',
    categoryId: 4,
    categoryName: '服饰鞋包',
    price: 799,
    stock: 1000,
    image: 'https://via.placeholder.com/300x300?text=NikeAF1',
    description: '经典白色空军一号，百搭休闲鞋',
    status: 1,
    createdAt: '2024-02-10 10:00:00',
    updatedAt: '2024-02-10 10:00:00',
  },
  {
    id: 10,
    name: '三只松鼠坚果礼盒 1.58kg',
    categoryId: 5,
    categoryName: '食品饮料',
    price: 128,
    stock: 2000,
    image: 'https://via.placeholder.com/300x300?text=Nuts',
    description: '精选坚果礼盒，年货送礼必备',
    status: 1,
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-01-10 10:00:00',
  },
  {
    id: 11,
    name: '索尼 WH-1000XM5 降噪耳机',
    categoryId: 1,
    categoryName: '手机数码',
    price: 2499,
    stock: 350,
    image: 'https://via.placeholder.com/300x300?text=SonyXM5',
    description: '行业领先降噪，30小时续航',
    status: 1,
    createdAt: '2024-02-15 10:00:00',
    updatedAt: '2024-02-15 10:00:00',
  },
  {
    id: 12,
    name: '戴尔 U2723QE 4K显示器',
    categoryId: 2,
    categoryName: '电脑办公',
    price: 3999,
    stock: 120,
    image: 'https://via.placeholder.com/300x300?text=DellMonitor',
    description: '27英寸4K，IPS Black面板，Type-C 90W',
    status: 0,
    createdAt: '2024-02-20 10:00:00',
    updatedAt: '2024-02-20 10:00:00',
  },
]

// 获取商品列表
export function getProductList(params: {
  page: number
  pageSize: number
  name?: string
  categoryId?: number
  status?: 0 | 1
}): ApiResponse<PageResult<Product>> {
  let filtered = [...products]
  if (params.name) {
    filtered = filtered.filter((p) => p.name.includes(params.name!))
  }
  if (params.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === params.categoryId)
  }
  if (params.status !== undefined) {
    filtered = filtered.filter((p) => p.status === params.status)
  }
  const start = (params.page - 1) * params.pageSize
  const list = filtered.slice(start, start + params.pageSize)
  return {
    code: 200,
    message: 'success',
    data: { list, total: filtered.length },
  }
}

// 获取分类列表
export function getCategoryList(): ApiResponse<Category[]> {
  return {
    code: 200,
    message: 'success',
    data: categories,
  }
}

// 获取商品详情
export function getProductDetail(id: number): ApiResponse<Product | null> {
  const product = products.find((p) => p.id === id) || null
  return {
    code: 200,
    message: 'success',
    data: product,
  }
}
