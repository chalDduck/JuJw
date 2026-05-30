'use client'


import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [nextPath, setNextPath] = useState('/admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get('next')
    if (value) {
      setNextPath(value)
    }
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string }
        throw new Error(payload.error || '로그인에 실패했습니다.')
      }

      router.replace(nextPath)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ef_0%,#f3ece3_100%)] px-4 py-8 text-stone-900 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_30px_90px_-46px_rgba(28,25,23,0.45)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="bg-stone-900 px-6 py-8 text-white sm:px-8 lg:flex lg:flex-col lg:justify-between lg:p-10">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/55">JU JEWELRY Admin</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">관리자 로그인</h1>
              <p className="mt-4 max-w-sm text-[15px] leading-7 text-white/72">
                제품, 문의, FAQ, 홈페이지 문구를 관리하는 전용 화면입니다.
              </p>
            </div>
            <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[14px] leading-7 text-white/70">
              접속 주소는 <span className="font-semibold text-white">/admin</span> 입니다. 휴대폰에서도 같은 주소로 접속할 수 있습니다.
            </p>
          </section>

          <section className="px-5 py-7 sm:px-8 sm:py-9 lg:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">계정 정보를 입력해 주세요</h2>
            <p className="mt-2 text-[15px] leading-7 text-stone-600">
              입력창과 버튼은 휴대폰 터치 기준으로 크게 맞췄습니다.
            </p>

            <form className="mt-7 space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-stone-800">아이디</label>
                <input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  inputMode="text"
                  className="min-h-[60px] w-full rounded-2xl border border-stone-300 px-4 text-[16px] text-stone-900 outline-none transition focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[15px] font-semibold text-stone-800">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="min-h-[60px] w-full rounded-2xl border border-stone-300 px-4 text-[16px] text-stone-900 outline-none transition focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-[15px] leading-6 text-red-700">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-stone-900 px-6 text-[16px] font-semibold text-white transition active:translate-y-px hover:bg-stone-700 disabled:opacity-60"
              >
                {isLoading ? '로그인 중입니다' : '로그인'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
