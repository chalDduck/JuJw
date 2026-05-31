import 'server-only'

import { getSupabaseAdmin } from '@/lib/supabase'
import { hasSupabase, isProductionRuntime } from '@/lib/env'
import type {
  Admin,
  Category,
  DashboardSummary,
  Inquiry,
  InquiryInput,
  InquiryStatus,
  Notice,
  NoticeInput,
  Product,
  ProductImage,
  ProductInput,
} from '@/lib/models'

/* -------------------------------------------------------------------------- */
/*  공통 타입 / 기본값                                                          */
/* -------------------------------------------------------------------------- */

type SettingsMap = Record<string, string>

type ProductRecord = {
  id: number
  categoryId: number
  name: string
  slug: string
  spec: string | null
  description: string | null
  isFeatured: boolean
  isPublished: boolean
  orderIndex: number
  createdAt: string
  updatedAt: string
}

type InquiryRecord = Inquiry & { ipAddress: string | null }
type NoticeRecord = Notice

const DEFAULT_SETTINGS: SettingsMap = {
  shop_name: 'JU JEWELRY',
  phone_primary: '02-744-6268',
  phone_secondary: '',
  email: 'bok00ju@naver.com',
  address: '서울 종로구 종로 173, 143호',
  business_hours: '매일 10:30 - 18:30',
  closed_day: '매달 셋째 주 화요일',
  naver_map_url: 'https://map.naver.com/p/search/서울 종로구 종로 173',
  instagram_url: 'https://www.instagram.com/bogju80?igsh=YXA4bzNieDQxYjUx',
  facebook_url: '',
  business_name: 'JU JEWELRY',
  representative_name: '',
  business_number: '206-17-48634',
  home_hero_line_1: '오래 간직할 수 있는 빛,',
  home_hero_line_2: 'Ju가 차분히 제안합니다',
  home_hero_cta: '컬렉션 보기',
  home_menu_cta: '상담 예약',
  home_menu_note: '제품 비교와 선물 상담이 필요하시면 문의 페이지에서 편하게 남겨 주세요.',
  home_benefit_1_title: '정교한 세공',
  home_benefit_1_description: '착용감과 비율까지 살핀 섬세한 마감',
  home_benefit_2_title: '선물 포장',
  home_benefit_2_description: '받는 순간까지 고급스럽게 완성하는 패키지',
  home_benefit_3_title: '엄선된 소재',
  home_benefit_3_description: '14K/18K 골드와 선별된 스톤의 안정적인 품질',
  home_benefit_4_title: '맞춤 상담',
  home_benefit_4_description: '예산과 용도에 맞춰 차분하게 제안합니다',
  home_brand_kicker: 'Brand Story',
  home_brand_title_1: '시간이 지나도',
  home_brand_title_2: '자연스럽게 빛나는 주얼리',
  home_brand_description:
    'Ju는 과한 장식보다 균형과 착용감을 먼저 봅니다. 매일의 옷차림에도, 특별한 날에도 편안하게 어울리는 주얼리를 제안합니다.',
  home_brand_cta: '브랜드 이야기 보기',
  home_collection_kicker: 'Collection',
  home_collection_title: '카테고리별 컬렉션',
  home_collection_necklaces_title: 'NECKLACES',
  home_collection_necklaces_subtitle: '목걸이',
  home_collection_earrings_title: 'EARRINGS',
  home_collection_earrings_subtitle: '귀걸이',
  home_collection_rings_title: 'RINGS',
  home_collection_rings_subtitle: '반지',
  home_collection_bracelets_title: 'BRACELETS',
  home_collection_bracelets_subtitle: '팔찌',
  home_recommended_kicker: 'Recommended',
  home_recommended_title: 'Ju 추천 제품',
  home_signature_kicker: 'Signature Collection',
  home_signature_title_1: '빛의 결을 담은',
  home_signature_title_2: '시그니처 컬렉션',
  home_signature_description:
    '작지만 선명한 반짝임, 매일 손이 가는 편안한 비율. Ju가 오래 착용할 수 있는 기본을 세심하게 고릅니다.',
  home_signature_cta: '시그니처 제품 보기',
  home_consult_kicker: 'Gift & Consultation',
  home_consult_title_1: '마음을 전하는 순간도',
  home_consult_title_2: '차분하게 준비해 드립니다',
  home_consult_description:
    '착용할 분의 취향, 예산, 필요한 날짜를 알려주시면 어울리는 제품과 포장까지 함께 안내해 드립니다.',
  home_consult_cta: '상담 예약하기',
  home_consult_feature_1_title: '선물 포장',
  home_consult_feature_1_description: '받는 순간까지 정돈된 패키지로 준비합니다.',
  home_consult_feature_2_title: '1:1 상담',
  home_consult_feature_2_description: '취향과 예산에 맞춰 부담 없이 비교해 드립니다.',
  home_consult_feature_3_title: '제품 확인',
  home_consult_feature_3_description: '소재와 스펙, 관리 방법까지 함께 안내합니다.',
  home_footer_note: '오래 착용할 수 있는 빛을 Ju의 시선으로 제안합니다.',
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: '반지', slug: 'rings', orderIndex: 1 },
  { id: 2, name: '목걸이', slug: 'necklaces', orderIndex: 2 },
  { id: 3, name: '귀걸이', slug: 'earrings', orderIndex: 3 },
  { id: 4, name: '팔찌', slug: 'bracelets', orderIndex: 4 },
]

/* -------------------------------------------------------------------------- */
/*  인메모리 fallback (Supabase 키가 없을 때만 사용)                            */
/* -------------------------------------------------------------------------- */

type MemoryStore = {
  categories: Category[]
  products: ProductRecord[]
  productImages: ProductImage[]
  inquiries: InquiryRecord[]
  settings: SettingsMap
  notices: NoticeRecord[]
  admins: Admin[]
  counters: { product: number; productImage: number; inquiry: number; notice: number; admin: number }
}

declare global {
  // eslint-disable-next-line no-var
  var __jujwStore: MemoryStore | undefined
}

function nowText(): string {
  return new Date().toISOString()
}

function createMemoryStore(): MemoryStore {
  const now = nowText()
  return {
    categories: [...DEFAULT_CATEGORIES],
    products: [
      {
        id: 1,
        categoryId: 1,
        name: '18K 솔리테어 반지',
        slug: '18k-solitaire-ring',
        spec: '0.3ct / 18K White Gold',
        description: '세련된 밴드 라인의 솔리테어 반지입니다.',
        isFeatured: true,
        isPublished: true,
        orderIndex: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        categoryId: 2,
        name: '사파이어 펜던트 목걸이',
        slug: 'sapphire-pendant-necklace',
        spec: '14K Gold / Natural Sapphire',
        description: '은은한 컬러감의 사파이어 포인트 목걸이입니다.',
        isFeatured: true,
        isPublished: true,
        orderIndex: 2,
        createdAt: now,
        updatedAt: now,
      },
    ],
    productImages: [
      { id: 1, productId: 1, objectKey: null, url: '/img/hero/hero.png', altText: '18K 솔리테어 반지', isPrimary: true, orderIndex: 1 },
      { id: 2, productId: 2, objectKey: null, url: '/img/hero/hero.png', altText: '사파이어 펜던트 목걸이', isPrimary: true, orderIndex: 1 },
    ],
    inquiries: [],
    settings: { ...DEFAULT_SETTINGS },
    notices: [],
    admins: [],
    counters: { product: 3, productImage: 3, inquiry: 1, notice: 1, admin: 1 },
  }
}

function memoryStore(): MemoryStore {
  if (!globalThis.__jujwStore) {
    globalThis.__jujwStore = createMemoryStore()
  }
  return globalThis.__jujwStore
}

function ensureWritableMemory(action: string): void {
  if (isProductionRuntime()) {
    throw new Error(`${action}: 운영 환경에서는 Supabase 연결이 필요합니다.`)
  }
}

/* -------------------------------------------------------------------------- */
/*  매핑 헬퍼                                                                   */
/* -------------------------------------------------------------------------- */

type ProductRow = {
  id: number
  categoryId: number
  name: string
  slug: string
  spec: string | null
  description: string | null
  isFeatured: boolean | number | null
  isPublished: boolean | number | null
  orderIndex: number | null
  createdAt: string
  updatedAt: string
  category?: { name?: string; slug?: string } | null
  images?: Array<{ url: string; isPrimary: boolean | number | null; orderIndex: number | null }> | null
}

function pickPrimaryImageUrl(images: ProductRow['images']): string | null {
  const list = Array.isArray(images) ? images : []
  if (list.length === 0) return null
  const primary = list.find((image) => Boolean(image.isPrimary))
  if (primary) return primary.url
  const sorted = [...list].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
  return sorted[0]?.url ?? null
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: Number(row.id),
    categoryId: Number(row.categoryId),
    categoryName: row.category?.name,
    categorySlug: row.category?.slug,
    name: row.name,
    slug: row.slug,
    spec: row.spec ?? null,
    description: row.description ?? null,
    isFeatured: Boolean(row.isFeatured),
    isPublished: Boolean(row.isPublished),
    orderIndex: Number(row.orderIndex ?? 0),
    imageUrl: pickPrimaryImageUrl(row.images),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

const PRODUCT_SELECT = `
  id,
  categoryId:category_id,
  name,
  slug,
  spec,
  description,
  isFeatured:is_featured,
  isPublished:is_published,
  orderIndex:order_index,
  createdAt:created_at,
  updatedAt:updated_at,
  category:categories(name, slug),
  images:product_images(url, isPrimary:is_primary, orderIndex:order_index)
`

const IMAGE_SELECT = `
  id,
  productId:product_id,
  objectKey:object_key,
  url,
  altText:alt_text,
  isPrimary:is_primary,
  orderIndex:order_index
`

function mapImageRow(row: {
  id: number
  productId: number
  objectKey: string | null
  url: string
  altText: string | null
  isPrimary: boolean | number | null
  orderIndex: number | null
}): ProductImage {
  return {
    id: Number(row.id),
    productId: Number(row.productId),
    objectKey: row.objectKey ?? null,
    url: row.url,
    altText: row.altText ?? null,
    isPrimary: Boolean(row.isPrimary),
    orderIndex: Number(row.orderIndex ?? 0),
  }
}

/* -------------------------------------------------------------------------- */
/*  카테고리                                                                    */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return [...memoryStore().categories]
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, orderIndex:order_index')
    .order('order_index', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: Number(row.id),
    name: row.name,
    slug: row.slug,
    orderIndex: Number(row.orderIndex ?? 0),
  }))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return memoryStore().categories.find((category) => category.slug === slug) ?? null
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, orderIndex:order_index')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  return { id: Number(data.id), name: data.name, slug: data.slug, orderIndex: Number(data.orderIndex ?? 0) }
}

/* -------------------------------------------------------------------------- */
/*  제품                                                                        */
/* -------------------------------------------------------------------------- */

type GetProductsOptions = {
  category?: string
  featured?: boolean
  published?: boolean
  limit?: number
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    const store = memoryStore()
    const categoryMap = new Map(store.categories.map((category) => [category.id, category]))
    return store.products
      .filter((product) => {
        const category = categoryMap.get(product.categoryId)
        if (options.category && category?.slug !== options.category) return false
        if (typeof options.featured === 'boolean' && product.isFeatured !== options.featured) return false
        if (typeof options.published === 'boolean' && product.isPublished !== options.published) return false
        return true
      })
      .sort((a, b) => a.orderIndex - b.orderIndex || b.id - a.id)
      .slice(0, options.limit && options.limit > 0 ? options.limit : undefined)
      .map((product) => {
        const category = categoryMap.get(product.categoryId)
        const primaryImage = store.productImages.find((image) => image.productId === product.id && image.isPrimary)
        return {
          id: product.id,
          categoryId: product.categoryId,
          categoryName: category?.name,
          categorySlug: category?.slug,
          name: product.name,
          slug: product.slug,
          spec: product.spec,
          description: product.description,
          isFeatured: product.isFeatured,
          isPublished: product.isPublished,
          orderIndex: product.orderIndex,
          imageUrl: primaryImage?.url ?? null,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      })
  }

  let query = supabase.from('products').select(PRODUCT_SELECT)

  if (options.category) {
    const category = await getCategoryBySlug(options.category)
    if (!category) return []
    query = query.eq('category_id', category.id)
  }
  if (typeof options.featured === 'boolean') {
    query = query.eq('is_featured', options.featured)
  }
  if (typeof options.published === 'boolean') {
    query = query.eq('is_published', options.published)
  }

  query = query.order('order_index', { ascending: true }).order('id', { ascending: false })
  if (options.limit && options.limit > 0) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return ((data ?? []) as unknown as ProductRow[]).map(mapProductRow)
}

export async function getProductById(id: number): Promise<Product | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    const products = await getProducts({})
    return products.find((product) => product.id === id) ?? null
  }

  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return mapProductRow(data as unknown as ProductRow)
}

export async function getProductBySlug(categorySlug: string, slug: string): Promise<Product | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    const products = await getProducts({ category: categorySlug })
    return products.find((product) => product.slug === slug) ?? null
  }

  const category = await getCategoryBySlug(categorySlug)
  if (!category) return null

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category_id', category.id)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return mapProductRow(data as unknown as ProductRow)
}

export async function getProductImages(productId: number): Promise<ProductImage[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return memoryStore()
      .productImages.filter((image) => image.productId === productId)
      .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id)
  }

  const { data, error } = await supabase
    .from('product_images')
    .select(IMAGE_SELECT)
    .eq('product_id', productId)
    .order('order_index', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(mapImageRow)
}

/**
 * slug가 다른 제품과 겹치지 않도록 보장합니다. (UNIQUE 제약 위반 방지)
 * 이미 사용 중이면 base, base-2, base-3 … 순으로 비어 있는 값을 찾습니다.
 */
async function resolveUniqueSlug(base: string, excludeId?: number): Promise<string> {
  const cleanBase = base.trim() || `item-${Date.now().toString(36)}`
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    const store = memoryStore()
    const taken = new Set(
      store.products.filter((product) => product.id !== excludeId).map((product) => product.slug)
    )
    if (!taken.has(cleanBase)) return cleanBase
    let n = 2
    while (taken.has(`${cleanBase}-${n}`)) n += 1
    return `${cleanBase}-${n}`
  }

  let query = supabase.from('products').select('slug').like('slug', `${cleanBase}%`)
  if (typeof excludeId === 'number') {
    query = query.neq('id', excludeId)
  }
  const { data } = await query
  const taken = new Set((data ?? []).map((row) => row.slug))
  if (!taken.has(cleanBase)) return cleanBase
  let n = 2
  while (taken.has(`${cleanBase}-${n}`)) n += 1
  return `${cleanBase}-${n}`
}

export async function createProduct(input: ProductInput): Promise<Product | null> {
  const uniqueSlug = await resolveUniqueSlug(input.slug)
  input = { ...input, slug: uniqueSlug }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('제품 등록')
    const store = memoryStore()
    const id = store.counters.product++
    store.products.push({
      id,
      categoryId: input.categoryId,
      name: input.name.trim(),
      slug: input.slug.trim(),
      spec: input.spec ?? null,
      description: input.description ?? null,
      isFeatured: input.isFeatured ?? false,
      isPublished: input.isPublished ?? true,
      orderIndex: input.orderIndex ?? 0,
      createdAt: nowText(),
      updatedAt: nowText(),
    })
    return getProductById(id)
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      category_id: input.categoryId,
      name: input.name.trim(),
      slug: input.slug.trim(),
      spec: input.spec ?? null,
      description: input.description ?? null,
      is_featured: input.isFeatured ?? false,
      is_published: input.isPublished ?? true,
      order_index: input.orderIndex ?? 0,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return getProductById(Number(data.id))
}

export async function updateProduct(id: number, input: Partial<ProductInput>): Promise<Product | null> {
  if (typeof input.slug === 'string' && input.slug.trim()) {
    input = { ...input, slug: await resolveUniqueSlug(input.slug, id) }
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('제품 수정')
    const store = memoryStore()
    const target = store.products.find((product) => product.id === id)
    if (!target) return null
    if (typeof input.categoryId === 'number') target.categoryId = input.categoryId
    if (typeof input.name === 'string') target.name = input.name.trim()
    if (typeof input.slug === 'string') target.slug = input.slug.trim()
    if (typeof input.spec !== 'undefined') target.spec = input.spec ?? null
    if (typeof input.description !== 'undefined') target.description = input.description ?? null
    if (typeof input.isFeatured === 'boolean') target.isFeatured = input.isFeatured
    if (typeof input.isPublished === 'boolean') target.isPublished = input.isPublished
    if (typeof input.orderIndex === 'number') target.orderIndex = input.orderIndex
    target.updatedAt = nowText()
    return getProductById(id)
  }

  const patch: Record<string, unknown> = { updated_at: nowText() }
  if (typeof input.categoryId === 'number') patch.category_id = input.categoryId
  if (typeof input.name === 'string') patch.name = input.name.trim()
  if (typeof input.slug === 'string') patch.slug = input.slug.trim()
  if (typeof input.spec !== 'undefined') patch.spec = input.spec ?? null
  if (typeof input.description !== 'undefined') patch.description = input.description ?? null
  if (typeof input.isFeatured === 'boolean') patch.is_featured = input.isFeatured
  if (typeof input.isPublished === 'boolean') patch.is_published = input.isPublished
  if (typeof input.orderIndex === 'number') patch.order_index = input.orderIndex

  const { error } = await supabase.from('products').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
  return getProductById(id)
}

export async function deleteProduct(id: number): Promise<{ ok: boolean; imageKeys: string[] }> {
  const existingImages = await getProductImages(id)
  const imageKeys = existingImages
    .map((image) => image.objectKey)
    .filter((key): key is string => Boolean(key))

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('제품 삭제')
    const store = memoryStore()
    const before = store.products.length
    store.products = store.products.filter((product) => product.id !== id)
    store.productImages = store.productImages.filter((image) => image.productId !== id)
    return { ok: store.products.length !== before, imageKeys }
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return { ok: true, imageKeys }
}

/* -------------------------------------------------------------------------- */
/*  제품 이미지                                                                 */
/* -------------------------------------------------------------------------- */

export async function addProductImage(input: {
  productId: number
  objectKey: string | null
  url: string
  altText?: string | null
  isPrimary?: boolean
  orderIndex?: number
}): Promise<ProductImage | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('이미지 등록')
    const store = memoryStore()
    if (input.isPrimary) {
      store.productImages = store.productImages.map((image) =>
        image.productId === input.productId ? { ...image, isPrimary: false } : image
      )
    }
    const image: ProductImage = {
      id: store.counters.productImage++,
      productId: input.productId,
      objectKey: input.objectKey,
      url: input.url,
      altText: input.altText ?? null,
      isPrimary: Boolean(input.isPrimary),
      orderIndex: input.orderIndex ?? 0,
    }
    store.productImages.push(image)
    return image
  }

  if (input.isPrimary) {
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', input.productId)
  }

  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: input.productId,
      object_key: input.objectKey,
      url: input.url,
      alt_text: input.altText ?? null,
      is_primary: input.isPrimary ?? false,
      order_index: input.orderIndex ?? 0,
    })
    .select(IMAGE_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return mapImageRow(data)
}

export async function deleteProductImage(id: number): Promise<{ ok: boolean; imageKey: string | null }> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('이미지 삭제')
    const store = memoryStore()
    const target = store.productImages.find((image) => image.id === id)
    if (!target) return { ok: false, imageKey: null }
    store.productImages = store.productImages.filter((image) => image.id !== id)
    if (target.isPrimary) {
      const fallback = store.productImages
        .filter((image) => image.productId === target.productId)
        .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id)[0]
      if (fallback) fallback.isPrimary = true
    }
    return { ok: true, imageKey: target.objectKey }
  }

  const { data: row, error: findError } = await supabase
    .from('product_images')
    .select('id, productId:product_id, objectKey:object_key, isPrimary:is_primary')
    .eq('id', id)
    .maybeSingle()

  if (findError) throw new Error(findError.message)
  if (!row) return { ok: false, imageKey: null }

  const { error: deleteError } = await supabase.from('product_images').delete().eq('id', id)
  if (deleteError) throw new Error(deleteError.message)

  if (row.isPrimary) {
    const { data: fallback } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', row.productId)
      .order('order_index', { ascending: true })
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (fallback) {
      await supabase.from('product_images').update({ is_primary: true }).eq('id', fallback.id)
    }
  }

  return { ok: true, imageKey: (row.objectKey as string | null) ?? null }
}

export async function setPrimaryProductImage(id: number): Promise<ProductImage | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('대표사진 설정')
    const store = memoryStore()
    const target = store.productImages.find((image) => image.id === id)
    if (!target) return null
    store.productImages = store.productImages.map((image) =>
      image.productId === target.productId ? { ...image, isPrimary: image.id === target.id } : image
    )
    return store.productImages.find((image) => image.id === id) ?? null
  }

  const { data: row, error } = await supabase
    .from('product_images')
    .select(IMAGE_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!row) return null

  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', row.productId)
  await supabase.from('product_images').update({ is_primary: true }).eq('id', id)

  return mapImageRow({ ...row, isPrimary: true })
}

/* -------------------------------------------------------------------------- */
/*  문의                                                                        */
/* -------------------------------------------------------------------------- */

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('문의 접수')
    const store = memoryStore()
    const inquiry: InquiryRecord = {
      id: store.counters.inquiry++,
      companyName: input.companyName.trim(),
      phone: input.phone.trim(),
      interest: input.interest ?? null,
      message: input.message ?? null,
      status: 'pending',
      ipAddress: input.ipAddress ?? null,
      createdAt: nowText(),
      updatedAt: nowText(),
    }
    store.inquiries.unshift(inquiry)
    return inquiry
  }

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      company_name: input.companyName.trim(),
      phone: input.phone.trim(),
      interest: input.interest ?? null,
      message: input.message ?? null,
      status: 'pending',
      ip_address: input.ipAddress ?? null,
    })
    .select('id, companyName:company_name, phone, interest, message, status, createdAt:created_at, updatedAt:updated_at')
    .single()

  if (error) throw new Error(error.message)
  return data as Inquiry
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return [...memoryStore().inquiries].sort((a, b) => b.id - a.id)
  }

  const { data, error } = await supabase
    .from('inquiries')
    .select('id, companyName:company_name, phone, interest, message, status, createdAt:created_at, updatedAt:updated_at')
    .order('id', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Inquiry[]
}

export async function updateInquiryStatus(id: number, status: InquiryStatus): Promise<Inquiry | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('문의 상태 변경')
    const store = memoryStore()
    const target = store.inquiries.find((inquiry) => inquiry.id === id)
    if (!target) return null
    target.status = status
    target.updatedAt = nowText()
    return target
  }

  const { data, error } = await supabase
    .from('inquiries')
    .update({ status, updated_at: nowText() })
    .eq('id', id)
    .select('id, companyName:company_name, phone, interest, message, status, createdAt:created_at, updatedAt:updated_at')
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as Inquiry) ?? null
}

/* -------------------------------------------------------------------------- */
/*  설정                                                                        */
/* -------------------------------------------------------------------------- */

export async function getPublicSettings(): Promise<SettingsMap> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { ...memoryStore().settings }
  }

  const { data, error } = await supabase.from('settings').select('key, value')
  if (error) throw new Error(error.message)

  const map = (data ?? []).reduce<SettingsMap>((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  // 기본값을 베이스로 깔아 누락 키를 보완
  return { ...DEFAULT_SETTINGS, ...map }
}

export async function getAllSettings(): Promise<SettingsMap> {
  return getPublicSettings()
}

export async function upsertSettings(settings: SettingsMap): Promise<void> {
  const entries = Object.entries(settings)
  if (entries.length === 0) return

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('설정 저장')
    const store = memoryStore()
    for (const [key, value] of entries) {
      store.settings[key] = value
    }
    return
  }

  const rows = entries.map(([key, value]) => ({ key, value, updated_at: nowText() }))
  const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
  if (error) throw new Error(error.message)
}

/* -------------------------------------------------------------------------- */
/*  관리자                                                                      */
/* -------------------------------------------------------------------------- */

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return memoryStore().admins.find((admin) => admin.email === email) ?? null
  }

  const { data, error } = await supabase
    .from('admins')
    .select('id, email, name, passwordHash:password_hash')
    .eq('email', email)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return { id: Number(data.id), email: data.email, name: data.name ?? null, passwordHash: data.passwordHash }
}

export async function upsertAdmin(input: {
  email: string
  name?: string | null
  passwordHash: string
}): Promise<void> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('관리자 저장')
    const store = memoryStore()
    const existing = store.admins.find((admin) => admin.email === input.email)
    if (existing) {
      existing.name = input.name ?? null
      existing.passwordHash = input.passwordHash
      return
    }
    store.admins.push({ id: store.counters.admin++, email: input.email, name: input.name ?? null, passwordHash: input.passwordHash })
    return
  }

  const { error } = await supabase
    .from('admins')
    .upsert({ email: input.email, name: input.name ?? null, password_hash: input.passwordHash }, { onConflict: 'email' })

  if (error) throw new Error(error.message)
}

/* -------------------------------------------------------------------------- */
/*  공지사항                                                                    */
/* -------------------------------------------------------------------------- */

type NoticeOptions = { publishedOnly?: boolean; limit?: number }

const NOTICE_SELECT = 'id, title, content, isPublished:is_published, isPinned:is_pinned, createdAt:created_at, updatedAt:updated_at'

function mapNoticeRow(row: {
  id: number
  title: string
  content: string
  isPublished: boolean | number | null
  isPinned: boolean | number | null
  createdAt: string
  updatedAt: string
}): Notice {
  return {
    id: Number(row.id),
    title: row.title,
    content: row.content,
    isPublished: Boolean(row.isPublished),
    isPinned: Boolean(row.isPinned),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function getNotices(options: NoticeOptions = {}): Promise<Notice[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return [...memoryStore().notices]
      .filter((notice) => (options.publishedOnly ? notice.isPublished : true))
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.id - a.id)
      .slice(0, options.limit && options.limit > 0 ? options.limit : undefined)
  }

  let query = supabase.from('notices').select(NOTICE_SELECT)
  if (options.publishedOnly) query = query.eq('is_published', true)
  query = query.order('is_pinned', { ascending: false }).order('id', { ascending: false })
  if (options.limit && options.limit > 0) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapNoticeRow)
}

export async function getNoticeById(id: number): Promise<Notice | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return memoryStore().notices.find((notice) => notice.id === id) ?? null
  }

  const { data, error } = await supabase.from('notices').select(NOTICE_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return mapNoticeRow(data)
}

export async function createNotice(input: NoticeInput): Promise<Notice | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('공지 등록')
    const store = memoryStore()
    const notice: NoticeRecord = {
      id: store.counters.notice++,
      title: input.title,
      content: input.content,
      isPublished: input.isPublished ?? true,
      isPinned: input.isPinned ?? false,
      createdAt: nowText(),
      updatedAt: nowText(),
    }
    store.notices.unshift(notice)
    return notice
  }

  const { data, error } = await supabase
    .from('notices')
    .insert({
      title: input.title,
      content: input.content,
      is_published: input.isPublished ?? true,
      is_pinned: input.isPinned ?? false,
    })
    .select(NOTICE_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return mapNoticeRow(data)
}

export async function updateNotice(id: number, input: NoticeInput): Promise<Notice | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('공지 수정')
    const store = memoryStore()
    const target = store.notices.find((notice) => notice.id === id)
    if (!target) return null
    target.title = input.title
    target.content = input.content
    target.isPublished = input.isPublished ?? target.isPublished
    target.isPinned = input.isPinned ?? target.isPinned
    target.updatedAt = nowText()
    return target
  }

  const { data, error } = await supabase
    .from('notices')
    .update({
      title: input.title,
      content: input.content,
      is_published: input.isPublished ?? true,
      is_pinned: input.isPinned ?? false,
      updated_at: nowText(),
    })
    .eq('id', id)
    .select(NOTICE_SELECT)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return mapNoticeRow(data)
}

export async function deleteNotice(id: number): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    ensureWritableMemory('공지 삭제')
    const store = memoryStore()
    const before = store.notices.length
    store.notices = store.notices.filter((notice) => notice.id !== id)
    return before !== store.notices.length
  }

  const { error } = await supabase.from('notices').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return true
}

/* -------------------------------------------------------------------------- */
/*  대시보드                                                                    */
/* -------------------------------------------------------------------------- */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    const store = memoryStore()
    return {
      productCount: store.products.length,
      pendingInquiryCount: store.inquiries.filter((inquiry) => inquiry.status === 'pending').length,
      totalInquiryCount: store.inquiries.length,
      noticeCount: store.notices.length,
    }
  }

  const [products, pending, totalInquiries, notices] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('notices').select('*', { count: 'exact', head: true }),
  ])

  return {
    productCount: products.count ?? 0,
    pendingInquiryCount: pending.count ?? 0,
    totalInquiryCount: totalInquiries.count ?? 0,
    noticeCount: notices.count ?? 0,
  }
}

export { hasSupabase }
