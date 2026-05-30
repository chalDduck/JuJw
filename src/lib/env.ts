/**
 * 환경 변수 접근 헬퍼.
 *
 * 모든 값은 일반 문자열(시크릿/변수)이므로 `process.env`로 읽습니다.
 * - 로컬 개발: `.env.local`을 Next.js가 자동 로드합니다.
 * - Cloudflare Workers(OpenNext): `wrangler secret put` / `[vars]`로 넣은 값이
 *   런타임에 `process.env`로 노출됩니다. (D1/R2 같은 "바인딩"이 아니라 문자열이라 가능)
 */

function readEnv(key: string): string | undefined {
  const value = process.env[key]
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  return undefined
}

export function getEnv(key: string): string | undefined {
  return readEnv(key)
}

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production'
}

// --- Supabase ---------------------------------------------------------------

export function getSupabaseUrl(): string | undefined {
  return readEnv('SUPABASE_URL') ?? readEnv('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseServiceKey(): string | undefined {
  return readEnv('SUPABASE_SERVICE_ROLE_KEY')
}

export function getSupabaseAnonKey(): string | undefined {
  return readEnv('SUPABASE_ANON_KEY') ?? readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function getStorageBucket(): string {
  return readEnv('SUPABASE_STORAGE_BUCKET') ?? 'product-images'
}

export function hasSupabase(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey())
}

// --- Site / Auth ------------------------------------------------------------

export function getSiteUrl(): string {
  return (
    readEnv('SITE_URL') ??
    readEnv('NEXT_PUBLIC_SITE_URL') ??
    'https://jujw.pages.dev'
  )
}

export function isHttpsSite(): boolean {
  return getSiteUrl().startsWith('https')
}

export function getOptionalJwtSecret(): string | undefined {
  return readEnv('JWT_SECRET') ?? readEnv('SESSION_SECRET')
}

export function getJwtSecret(): string {
  const secret = getOptionalJwtSecret()
  if (secret) {
    return secret
  }

  if (isProductionRuntime()) {
    throw new Error('JWT_SECRET is required in production.')
  }

  return 'dev-only-local-secret'
}

export function getAdminEmail(): string | undefined {
  return readEnv('ADMIN_EMAIL')
}

export function getAdminPassword(): string | undefined {
  return readEnv('ADMIN_PASSWORD')
}
