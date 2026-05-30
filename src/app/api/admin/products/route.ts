
import { NextResponse } from 'next/server'
import { createSlug, jsonError, requireAdmin } from '@/lib/api'
import { createProduct, getCategories, getProductImages, getProducts } from '@/lib/db'

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const products = await getProducts({ published: undefined })

  const withImages = await Promise.all(
    products.map(async (product) => ({
      ...product,
      images: await getProductImages(product.id),
    }))
  )

  return NextResponse.json({ products: withImages })
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  let payload: {
    categoryId?: number
    name?: string
    slug?: string
    spec?: string
    description?: string
    isFeatured?: boolean
    isPublished?: boolean
    orderIndex?: number
  }

  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  const categoryId = Number(payload.categoryId)
  const name = payload.name?.trim() || ''

  if (!categoryId || !name) {
    return jsonError('카테고리와 제품명은 필수입니다.', 400)
  }

  const categories = await getCategories()
  if (!categories.find((item) => item.id === categoryId)) {
    return jsonError('유효하지 않은 카테고리입니다.', 400)
  }

  const product = await createProduct({
    categoryId,
    name,
    slug: payload.slug?.trim() || createSlug(name),
    spec: payload.spec?.trim() || null,
    description: payload.description?.trim() || null,
    isFeatured: Boolean(payload.isFeatured),
    isPublished: payload.isPublished ?? true,
    orderIndex: payload.orderIndex ?? 0,
  })

  if (!product) {
    return jsonError('제품 생성에 실패했습니다.', 500)
  }

  return NextResponse.json({
    ok: true,
    product,
  })
}
