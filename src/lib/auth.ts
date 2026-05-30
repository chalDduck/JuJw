import type { NextRequest } from 'next/server'
import { getAdminEmail, getAdminPassword, getJwtSecret, isHttpsSite } from '@/lib/env'

export const ADMIN_AUTH_COOKIE = 'jujw_admin_token'
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7

type JwtPayload = {
  sub: string
  email: string
  name?: string | null
  exp: number
  iat: number
}

export type AdminSession = {
  id: number
  email: string
  name: string | null
}

function encoder(): TextEncoder {
  return new TextEncoder()
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i] as number)
  }
  if (typeof btoa === 'function') {
    return btoa(binary)
  }
  return Buffer.from(bytes).toString('base64')
}

function base64ToBytes(base64: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }
  return new Uint8Array(Buffer.from(base64, 'base64'))
}

function toBase64Url(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? encoder().encode(input) : input
  return bytesToBase64(bytes)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function fromBase64Url(base64url: string): string {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4)
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + padding
  return new TextDecoder().decode(base64ToBytes(base64))
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder().encode(message))
  return toBase64Url(new Uint8Array(signature))
}

export async function createAdminToken(payload: {
  id: number
  email: string
  name?: string | null
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const body: JwtPayload = {
    sub: String(payload.id),
    email: payload.email,
    name: payload.name ?? null,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  }

  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const bodyEncoded = toBase64Url(JSON.stringify(body))
  const data = `${header}.${bodyEncoded}`
  const signature = await hmacSha256(data, getJwtSecret())

  return `${data}.${signature}`
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  const [header, payload, signature] = token.split('.')
  if (!header || !payload || !signature) {
    return null
  }

  const data = `${header}.${payload}`
  const expected = await hmacSha256(data, getJwtSecret())
  if (expected !== signature) {
    return null
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as JwtPayload
    if (Date.now() / 1000 > parsed.exp) {
      return null
    }

    return {
      id: Number(parsed.sub),
      email: parsed.email,
      name: parsed.name ?? null,
    }
  } catch {
    return null
  }
}

function readCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null
  }

  const cookies = cookieHeader.split(';').map((item) => item.trim())
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split('=')
    if (key === name) {
      return rest.join('=')
    }
  }

  return null
}

export function getAdminTokenFromRequest(request: Request | NextRequest): string | null {
  return readCookieValue(request.headers.get('cookie'), ADMIN_AUTH_COOKIE)
}

export async function getAdminSessionFromRequest(
  request: Request | NextRequest
): Promise<AdminSession | null> {
  const token = getAdminTokenFromRequest(request)
  if (!token) {
    return null
  }

  return verifyAdminToken(token)
}

export function createAuthCookie(token: string): string {
  const secure = isHttpsSite() ? '; Secure' : ''
  return `${ADMIN_AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS}${secure}`
}

export function clearAuthCookie(): string {
  const secure = isHttpsSite() ? '; Secure' : ''
  return `${ADMIN_AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

function randomSalt(length = 16): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return toBase64Url(bytes)
}

async function pbkdf2(password: string, salt: string, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder().encode(salt),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )

  return toBase64Url(new Uint8Array(derivedBits))
}

export async function hashPassword(password: string): Promise<string> {
  const iterations = 120000
  const salt = randomSalt(16)
  const hash = await pbkdf2(password, salt, iterations)
  return `pbkdf2$${iterations}$${salt}$${hash}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, iterationsText, salt, hash] = storedHash.split('$')
  if (algorithm !== 'pbkdf2' || !iterationsText || !salt || !hash) {
    return false
  }

  const computed = await pbkdf2(password, salt, Number(iterationsText))
  return computed === hash
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminSession | null> {
  // db는 동적 import: 미들웨어(엣지) 번들에 Supabase가 포함되지 않도록 함
  const { getAdminByEmail } = await import('@/lib/db')
  const admin = await getAdminByEmail(email)

  if (admin) {
    const valid = await verifyPassword(password, admin.passwordHash)
    if (!valid) {
      return null
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    }
  }

  const fallbackEmail = getAdminEmail()
  const fallbackPassword = getAdminPassword()

  if (
    fallbackEmail &&
    fallbackPassword &&
    email === fallbackEmail &&
    password === fallbackPassword
  ) {
    return {
      id: 0,
      email: fallbackEmail,
      name: 'Administrator',
    }
  }

  return null
}
