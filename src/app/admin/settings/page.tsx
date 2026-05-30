'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings'

type Settings = Record<string, string>
type Field = { key: string; label: string; multiline?: boolean; placeholder?: string; helper?: string }
type Group = { title: string; fields: Field[] }

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

const GROUPS: Group[] = [
  {
    title: '1. 브랜드 / 사업자',
    fields: [
      { key: 'shop_name', label: '브랜드명', placeholder: '예: JU JEWELRY' },
      { key: 'business_name', label: '사업자 상호' },
      { key: 'representative_name', label: '대표자명' },
      { key: 'business_number', label: '사업자등록번호', placeholder: '000-00-00000' },
    ],
  },
  {
    title: '2. 연락처',
    fields: [
      { key: 'phone_primary', label: '대표 전화', placeholder: '02-000-0000' },
      { key: 'phone_secondary', label: '보조 전화 (선택)' },
      { key: 'email', label: '이메일', placeholder: 'contact@example.com' },
    ],
  },
  {
    title: '3. 위치 / 영업',
    fields: [
      { key: 'address', label: '주소', multiline: true },
      { key: 'business_hours', label: '영업시간', multiline: true, placeholder: '평일 10:30 - 19:30' },
      { key: 'closed_day', label: '휴무일', placeholder: '화요일 휴무' },
      { key: 'naver_map_url', label: '네이버 지도 링크 (선택)', helper: '네이버 지도에서 매장을 검색한 주소를 붙여넣으세요.' },
    ],
  },
  {
    title: '4. SNS (선택)',
    fields: [
      { key: 'instagram_url', label: '인스타그램 주소' },
      { key: 'facebook_url', label: '페이스북 주소' },
    ],
  },
]

const inputClass =
  'min-h-[54px] w-full rounded-2xl border border-stone-300 bg-white px-4 text-[16px] text-stone-950 outline-none transition focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70'
const textareaClass =
  'w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-[16px] leading-8 text-stone-950 outline-none transition focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70'

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

  const updateSetting = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }))

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
      setMessage('저장되었습니다. 홈페이지에 바로 반영됩니다.')
    } else {
      setMessage('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return <p className="mx-auto max-w-2xl p-6 text-[16px] text-stone-500">불러오는 중입니다…</p>
  }

  return (
    <form className="mx-auto max-w-2xl pb-28" onSubmit={onSubmit}>
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <section key={group.title} className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-[18px] font-bold tracking-tight text-stone-950">{group.title}</h2>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-[15px] font-semibold text-stone-800">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={2}
                      className={textareaClass}
                    />
                  ) : (
                    <input
                      value={settings[field.key] || ''}
                      onChange={(e) => updateSetting(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  )}
                  {field.helper ? <p className="mt-1.5 text-[13px] leading-5 text-stone-500">{field.helper}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 맨 아래 고정 저장바 */}
      <div className="sticky bottom-0 z-20 mt-5 -mx-4 border-t border-stone-200 bg-[#f3f0ea]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {message ? (
          <p
            className={`mb-2 rounded-2xl px-4 py-2.5 text-[14px] ${
              message.includes('실패') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-[17px] font-bold text-white transition active:translate-y-px disabled:opacity-60"
        >
          <Save size={19} />
          {isSaving ? '저장 중…' : '저장하기'}
        </button>
      </div>
    </form>
  )
}
