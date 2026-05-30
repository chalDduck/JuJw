
import { NextResponse } from 'next/server'
import { jsonError, requireAdmin } from '@/lib/api'
import { addProductImage } from '@/lib/db'
import { uploadProductImage } from '@/lib/storage'

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const formData = await request.formData()
  const productId = Number(formData.get('productId'))
  const primaryIndex = Number(formData.get('primaryIndex') || '0')
  const multiFiles = formData.getAll('files').filter((entry): entry is File => entry instanceof File)
  const singleFile = formData.get('file')
  const files = multiFiles.length
    ? multiFiles
    : singleFile instanceof File
      ? [singleFile]
      : []

  if (files.length === 0) {
    return jsonError('업로드할 파일이 필요합니다.', 400)
  }

  if (!productId) {
    return jsonError('productId가 필요합니다.', 400)
  }

  try {
    const images = []

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index]
      const uploaded = await uploadProductImage({
        productId,
        file,
      })

      const image = await addProductImage({
        productId,
        objectKey: uploaded.key,
        url: uploaded.url,
        altText: file.name,
        isPrimary: index === primaryIndex,
        orderIndex: index,
      })

      if (image) {
        images.push(image)
      }
    }

    return NextResponse.json({
      ok: true,
      images,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '업로드에 실패했습니다.'
    return jsonError(message, 400)
  }
}
