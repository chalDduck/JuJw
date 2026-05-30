import 'server-only'

import { getStorageBucket } from '@/lib/env'
import { getSupabaseAdmin } from '@/lib/supabase'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const PLACEHOLDER_URL = '/img/hero/hero.png'

type UploadResult = {
  key: string | null
  url: string
}

function sanitizeFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '') || 'image'
  )
}

function extensionFromMimeType(type: string): string {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  return 'jpg'
}

/**
 * 제품 이미지를 Supabase Storage(public bucket)에 업로드합니다.
 * Storage가 구성되지 않은 로컬 환경에서는 placeholder URL을 반환합니다.
 */
export async function uploadProductImage(input: {
  productId: number
  file: File
}): Promise<UploadResult> {
  const { productId, file } = input

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('jpg, png, webp 사진만 올릴 수 있습니다.')
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('한 장에 최대 10MB까지 올릴 수 있습니다.')
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { key: null, url: PLACEHOLDER_URL }
  }

  const extension = extensionFromMimeType(file.type)
  const base = sanitizeFilename(file.name || `product-${productId}`)
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`
  const key = `products/${productId}/${unique}-${base}.${extension}`

  const bucket = getStorageBucket()
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await supabase.storage.from(bucket).upload(key, arrayBuffer, {
    contentType: file.type,
    upsert: true,
  })

  if (error) {
    throw new Error(`이미지 업로드 실패: ${error.message}`)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(key)
  return { key, url: data.publicUrl }
}

export async function deleteStorageObject(key: string | null | undefined): Promise<void> {
  if (!key) return
  const supabase = getSupabaseAdmin()
  if (!supabase) return
  await supabase.storage.from(getStorageBucket()).remove([key])
}
