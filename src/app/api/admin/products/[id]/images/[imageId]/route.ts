
import { NextResponse } from 'next/server'
import { jsonError, requireAdmin } from '@/lib/api'
import { deleteProductImage, setPrimaryProductImage } from '@/lib/db'
import { deleteStorageObject } from '@/lib/storage'

type RouteContext = {
  params: {
    id: string
    imageId: string
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const imageId = Number(context.params.imageId)
  if (!imageId) {
    return jsonError('잘못된 이미지 ID입니다.', 400)
  }

  try {
    const image = await setPrimaryProductImage(imageId)
    if (!image) {
      return jsonError('이미지를 찾을 수 없습니다.', 404)
    }

    return NextResponse.json({ ok: true, image })
  } catch (error) {
    const message = error instanceof Error ? error.message : '대표사진 설정에 실패했습니다.'
    return jsonError(message, 500)
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const imageId = Number(context.params.imageId)
  if (!imageId) {
    return jsonError('잘못된 이미지 ID입니다.', 400)
  }

  try {
    const result = await deleteProductImage(imageId)
    if (!result.ok) {
      return jsonError('이미지를 찾을 수 없습니다.', 404)
    }

    if (result.imageKey) {
      await deleteStorageObject(result.imageKey)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : '이미지 삭제에 실패했습니다.'
    return jsonError(message, 500)
  }
}
