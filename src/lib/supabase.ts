import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseServiceKey, getSupabaseUrl } from '@/lib/env'

let cachedClient: SupabaseClient | null = null

/**
 * 서버 전용 Supabase 클라이언트(service_role 키).
 * 모든 데이터 접근은 서버(서버 컴포넌트 / API 라우트)에서만 일어나므로
 * service_role 키를 사용해도 안전합니다. 절대 클라이언트로 노출하지 않습니다.
 *
 * 키가 없으면 null을 반환하고, 호출부는 인메모리 fallback으로 동작합니다.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl()
  const key = getSupabaseServiceKey()

  if (!url || !key) {
    return null
  }

  if (cachedClient) {
    return cachedClient
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedClient
}
