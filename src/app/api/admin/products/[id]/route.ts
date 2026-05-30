
import { NextResponse } from 'next/server'
import { createSlug, jsonError, requireAdmin } from '@/lib/api'
import { deleteProduct, updateProduct } from '@/lib/db'
import { deleteStorageObject } from '@/lib/storage'

function parseId(value: string): number {
  return Number(value)
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const id = parseId(context.params.id)
  if (!id) {
    return jsonError('잘못된 제품 ID입니다.', 400)
  }

  let payload: {
    categoryId?: number
    name?: string
    slug?: string
    spec?: string | null
    description?: string | null
    isFeatured?: boolean
    isPublished?: boolean
    orderIndex?: number
  }

  try {
    payload = await request.json()
  } catch {
    return jsonError('잘못된 요청 본문입니다.', 400)
  }

  const nextName = payload.name?.trim()
  const product = await updateProduct(id, {
    categoryId: payload.categoryId,
    name: nextName,
    slug: payload.slug?.trim() || (nextName ? createSlug(nextName) : undefined),
    spec: typeof payload.spec === 'undefined' ? undefined : payload.spec,
    description: typeof payload.description === 'undefined' ? undefined : payload.description,
    isFeatured: payload.isFeatured,
    isPublished: payload.isPublished,
    orderIndex: payload.orderIndex,
  })

  if (!product) {
    return jsonError('제품을 찾을 수 없습니다.', 404)
  }

  return NextResponse.json({ ok: true, product })
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const id = parseId(context.params.id)
  if (!id) {
    return jsonError('잘못된 제품 ID입니다.', 400)
  }

  const result = await deleteProduct(id)
  if (!result.ok) {
    return jsonError('제품을 찾을 수 없습니다.', 404)
  }

  await Promise.all(result.imageKeys.map((key) => deleteStorageObject(key)))

  return NextResponse.json({ ok: true })
}
