'use client'


import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Save } from 'lucide-react'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings'

type Settings = Record<string, string>
type Field = {
  key: string
  label: string
  multiline?: boolean
  placeholder?: string
}

const DEFAULT_SETTINGS: Settings = {
  shop_name: DEFAULT_SITE_SETTINGS.shopName,
  business_name: DEFAULT_SITE_SETTINGS.businessName,
  representative_name: DEFAULT_SITE_SETTINGS.representativeName,
  business_number: DEFAULT_SITE_SETTINGS.businessNumber,
  phone_primary: DEFAULT_SITE_SETTINGS.phonePrimary,
  phone_secondary: DEFAULT_SITE_SETTINGS.phoneSecondary,
  email: DEFAULT_SITE_SETTINGS.email,
  address: DEFAULT_SITE_SETTINGS.address,
  business_hours: DEFAULT_SITE_SETTINGS.businessHours,
  closed_day: DEFAULT_SITE_SETTINGS.closedDay,
  naver_map_url: DEFAULT_SITE_SETTINGS.naverMapUrl,
  instagram_url: DEFAULT_SITE_SETTINGS.instagramUrl,
  facebook_url: DEFAULT_SITE_SETTINGS.facebookUrl,
}

const FIELDS: Field[] = [
  { key: 'shop_name', label: '브랜드명' },
  { key: 'business_name', label: '사업자 상호' },
  { key: 'representative_name', label: '대표자명' },
  { key: 'business_number', label: '사업자등록번호' },
  { key: 'phone_primary', label: '대표 전화', placeholder: '02-000-0000' },
  { key: 'phone_secondary', label: '보조 전화' },
  { key: 'email', label: '이메일', placeholder: 'contact@example.com' },
  { key: 'address', label: '주소', multiline: true },
  { key: 'business_hours', label: '영업시간', multiline: true },
  { key: 'closed_day', label: '휴무일' },
  { key: 'naver_map_url', label: '네이버 지도 URL' },
  { key: 'instagram_url', label: '인스타그램 URL' },
  { key: 'facebook_url', label: '페이스북 URL' },
]

const inputClass =
  'min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-3 text-[15px] text-stone-950 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200/80'

const textareaClass =
  'w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-[15px] leading-7 text-stone-950 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200/80'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' })
      if (response.ok) {
        const payload = (await response.json()) as { settings?: Settings }
        setSettings({ ...DEFAULT_SETTINGS, ...(payload.settings ?? {}) })
      }
      setIsLoading(false)
    }

    void load()
  }, [])

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')

    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    })

    if (response.ok) {
      const payload = (await response.json()) as { settings?: Settings }
      setSettings({ ...DEFAULT_SETTINGS, ...(payload.settings ?? settings) })
      setMessage('저장되었습니다.')
    } else {
      setMessage('저장에 실패했습니다.')
    }

    setIsSaving(false)
  }

  return (
    <form className="lg:h-full lg:min-h-0" onSubmit={onSubmit}>
      <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-[24px] border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-stone-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-stone-950">매장 기본 정보</h2>
              <p className="mt-1 text-[14px] leading-6 text-stone-500">
                연락처, 주소, SNS, 사업자 정보만 관리합니다. 홈 문구는 홈편집에서 수정합니다.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-sm font-semibold text-white transition active:translate-y-px disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? '저장 중' : '저장'}
            </button>
          </div>

          {isLoading ? (
            <p className="p-5 text-[15px] text-stone-500">불러오는 중입니다.</p>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:max-h-[calc(100dvh-185px)] lg:overflow-y-auto">
              {FIELDS.map((field) => (
                <div key={field.key} className={field.multiline ? 'sm:col-span-2' : undefined}>
                  <label className="mb-2 block text-[14px] font-semibold text-stone-800">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(event) => updateSetting(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className={textareaClass}
                    />
                  ) : (
                    <input
                      value={settings[field.key] || ''}
                      onChange={(event) => updateSetting(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="min-w-0 space-y-4 lg:min-h-0 lg:overflow-y-auto">
          <section className="rounded-[24px] border border-stone-200 bg-white p-5">
            <h3 className="text-lg font-semibold tracking-tight text-stone-950">노출 확인</h3>
            <div className="mt-4 divide-y divide-stone-200 text-[14px] leading-6 text-stone-700">
              <div className="pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Brand</p>
                <p className="mt-1 font-semibold text-stone-950">{settings.shop_name || '-'}</p>
                <p>{settings.business_name || '-'}</p>
              </div>
              <div className="py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Contact</p>
                <p className="mt-1">{settings.phone_primary || '-'}</p>
                {settings.phone_secondary ? <p>{settings.phone_secondary}</p> : null}
                <p>{settings.email || '-'}</p>
              </div>
              <div className="pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Location</p>
                <p className="mt-1 whitespace-pre-line break-words">{settings.address || '-'}</p>
                <p className="mt-2 whitespace-pre-line break-words">{settings.business_hours || '-'}</p>
              </div>
            </div>
            {message ? (
              <p
                className={`mt-4 rounded-2xl px-4 py-3 text-[13px] ${
                  message.includes('실패') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {message}
              </p>
            ) : null}
          </section>

          <Link
            href="/admin/home"
            className="flex min-h-[68px] items-center justify-between rounded-[24px] border border-stone-200 bg-[#211a16] px-5 text-[15px] font-semibold text-white transition active:translate-y-px hover:bg-[#33271f]"
          >
            홈 문구 수정하러 가기
            <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </form>
  )
}
