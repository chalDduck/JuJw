import 'server-only'

import {
  getCategories as getCategoriesFromDb,
  getCategoryBySlug as getCategoryBySlugFromDb,
  getNoticeById as getNoticeByIdFromDb,
  getNotices as getNoticesFromDb,
  getProductBySlug as getProductBySlugFromDb,
  getProductImages as getProductImagesFromDb,
  getProducts as getProductsFromDb,
  getPublicSettings as getPublicSettingsFromDb,
} from '@/lib/db'
import type { Category, Notice, Product, ProductImage } from '@/lib/models'

type GetProductsOptions = NonNullable<Parameters<typeof getProductsFromDb>[0]>
type GetNoticesOptions = NonNullable<Parameters<typeof getNoticesFromDb>[0]>

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: '반지', slug: 'rings', orderIndex: 1 },
  { id: 2, name: '목걸이', slug: 'necklaces', orderIndex: 2 },
  { id: 3, name: '귀걸이', slug: 'earrings', orderIndex: 3 },
  { id: 4, name: '팔찌', slug: 'bracelets', orderIndex: 4 },
  { id: 5, name: '액세서리', slug: 'accessories', orderIndex: 5 },
]

async function readPublicData<T>(
  operation: string,
  load: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  try {
    return await load()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[public-data] ${operation} failed; using fallback: ${message}`)
    return fallback()
  }
}

export function getCategories(): Promise<Category[]> {
  return readPublicData('getCategories', getCategoriesFromDb, () =>
    FALLBACK_CATEGORIES.map((category) => ({ ...category }))
  )
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return readPublicData(
    'getCategoryBySlug',
    () => getCategoryBySlugFromDb(slug),
    () => FALLBACK_CATEGORIES.find((category) => category.slug === slug) ?? null
  )
}

export function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  return readPublicData('getProducts', () => getProductsFromDb(options), () => [])
}

export function getProductBySlug(categorySlug: string, slug: string): Promise<Product | null> {
  return readPublicData(
    'getProductBySlug',
    () => getProductBySlugFromDb(categorySlug, slug),
    () => null
  )
}

export function getProductImages(productId: number): Promise<ProductImage[]> {
  return readPublicData('getProductImages', () => getProductImagesFromDb(productId), () => [])
}

export function getPublicSettings(): Promise<Record<string, string>> {
  return readPublicData('getPublicSettings', getPublicSettingsFromDb, () => ({}))
}

export function getNotices(options: GetNoticesOptions = {}): Promise<Notice[]> {
  return readPublicData('getNotices', () => getNoticesFromDb(options), () => [])
}

export function getNoticeById(id: number): Promise<Notice | null> {
  return readPublicData('getNoticeById', () => getNoticeByIdFromDb(id), () => null)
}
