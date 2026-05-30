'use client'


import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Save } from 'lucide-react'
import { DEFAULT_SITE_SETTINGS } from '@/lib/site-settings'

type Settings = Record<string, string>
type Field = {
  key: string
  label: string
  multiline?: boolean
  helper?: string
}
type Section = {
  id: string
  title: string
  description: string
  fields: Field[]
}

const DEFAULT_HOME_SETTINGS: Settings = {
  home_hero_line_1: DEFAULT_SITE_SETTINGS.homeHeroLine1,
  home_hero_line_2: DEFAULT_SITE_SETTINGS.homeHeroLine2,
  home_hero_cta: DEFAULT_SITE_SETTINGS.homeHeroCta,
  home_menu_cta: DEFAULT_SITE_SETTINGS.homeMenuCta,
  home_menu_note: DEFAULT_SITE_SETTINGS.homeMenuNote,
  home_benefit_1_title: DEFAULT_SITE_SETTINGS.homeBenefit1Title,
  home_benefit_1_description: DEFAULT_SITE_SETTINGS.homeBenefit1Description,
  home_benefit_2_title: DEFAULT_SITE_SETTINGS.homeBenefit2Title,
  home_benefit_2_description: DEFAULT_SITE_SETTINGS.homeBenefit2Description,
  home_benefit_3_title: DEFAULT_SITE_SETTINGS.homeBenefit3Title,
  home_benefit_3_description: DEFAULT_SITE_SETTINGS.homeBenefit3Description,
  home_benefit_4_title: DEFAULT_SITE_SETTINGS.homeBenefit4Title,
  home_benefit_4_description: DEFAULT_SITE_SETTINGS.homeBenefit4Description,
  home_brand_kicker: DEFAULT_SITE_SETTINGS.homeBrandKicker,
  home_brand_title_1: DEFAULT_SITE_SETTINGS.homeBrandTitle1,
  home_brand_title_2: DEFAULT_SITE_SETTINGS.homeBrandTitle2,
  home_brand_description: DEFAULT_SITE_SETTINGS.homeBrandDescription,
  home_brand_cta: DEFAULT_SITE_SETTINGS.homeBrandCta,
  home_collection_kicker: DEFAULT_SITE_SETTINGS.homeCollectionKicker,
  home_collection_title: DEFAULT_SITE_SETTINGS.homeCollectionTitle,
  home_collection_necklaces_title: DEFAULT_SITE_SETTINGS.homeCollectionNecklacesTitle,
  home_collection_necklaces_subtitle: DEFAULT_SITE_SETTINGS.homeCollectionNecklacesSubtitle,
  home_collection_earrings_title: DEFAULT_SITE_SETTINGS.homeCollectionEarringsTitle,
  home_collection_earrings_subtitle: DEFAULT_SITE_SETTINGS.homeCollectionEarringsSubtitle,
  home_collection_rings_title: DEFAULT_SITE_SETTINGS.homeCollectionRingsTitle,
  home_collection_rings_subtitle: DEFAULT_SITE_SETTINGS.homeCollectionRingsSubtitle,
  home_collection_bracelets_title: DEFAULT_SITE_SETTINGS.homeCollectionBraceletsTitle,
  home_collection_bracelets_subtitle: DEFAULT_SITE_SETTINGS.homeCollectionBraceletsSubtitle,
  home_recommended_kicker: DEFAULT_SITE_SETTINGS.homeRecommendedKicker,
  home_recommended_title: DEFAULT_SITE_SETTINGS.homeRecommendedTitle,
  home_signature_kicker: DEFAULT_SITE_SETTINGS.homeSignatureKicker,
  home_signature_title_1: DEFAULT_SITE_SETTINGS.homeSignatureTitle1,
  home_signature_title_2: DEFAULT_SITE_SETTINGS.homeSignatureTitle2,
  home_signature_description: DEFAULT_SITE_SETTINGS.homeSignatureDescription,
  home_signature_cta: DEFAULT_SITE_SETTINGS.homeSignatureCta,
  home_consult_kicker: DEFAULT_SITE_SETTINGS.homeConsultKicker,
  home_consult_title_1: DEFAULT_SITE_SETTINGS.homeConsultTitle1,
  home_consult_title_2: DEFAULT_SITE_SETTINGS.homeConsultTitle2,
  home_consult_description: DEFAULT_SITE_SETTINGS.homeConsultDescription,
  home_consult_cta: DEFAULT_SITE_SETTINGS.homeConsultCta,
  home_consult_feature_1_title: DEFAULT_SITE_SETTINGS.homeConsultFeature1Title,
  home_consult_feature_1_description: DEFAULT_SITE_SETTINGS.homeConsultFeature1Description,
  home_consult_feature_2_title: DEFAULT_SITE_SETTINGS.homeConsultFeature2Title,
  home_consult_feature_2_description: DEFAULT_SITE_SETTINGS.homeConsultFeature2Description,
  home_consult_feature_3_title: DEFAULT_SITE_SETTINGS.homeConsultFeature3Title,
  home_consult_feature_3_description: DEFAULT_SITE_SETTINGS.homeConsultFeature3Description,
  home_footer_note: DEFAULT_SITE_SETTINGS.homeFooterNote,
}

const SECTIONS: Section[] = [
  {
    id: 'hero',
    title: '첫 화면',
    description: '메인 접속 직후 보이는 히어로와 모바일 메뉴 하단 문구입니다.',
    fields: [
      { key: 'home_hero_line_1', label: '첫 화면 문구 1줄', helper: '모바일에서 자연스럽게 끊길 위치입니다.' },
      { key: 'home_hero_line_2', label: '첫 화면 문구 2줄' },
      { key: 'home_hero_cta', label: '첫 화면 버튼' },
      { key: 'home_menu_cta', label: '모바일 메뉴 버튼' },
      { key: 'home_menu_note', label: '모바일 메뉴 안내', multiline: true },
    ],
  },
  {
    id: 'benefits',
    title: '장점 4개',
    description: '히어로 바로 아래에 나오는 짧은 설명 4개입니다.',
    fields: [
      { key: 'home_benefit_1_title', label: '장점 1 제목' },
      { key: 'home_benefit_1_description', label: '장점 1 설명' },
      { key: 'home_benefit_2_title', label: '장점 2 제목' },
      { key: 'home_benefit_2_description', label: '장점 2 설명' },
      { key: 'home_benefit_3_title', label: '장점 3 제목' },
      { key: 'home_benefit_3_description', label: '장점 3 설명' },
      { key: 'home_benefit_4_title', label: '장점 4 제목' },
      { key: 'home_benefit_4_description', label: '장점 4 설명' },
    ],
  },
  {
    id: 'story',
    title: '브랜드 / 컬렉션',
    description: '브랜드 스토리와 컬렉션 섹션의 제목, 버튼, 카드명을 수정합니다.',
    fields: [
      { key: 'home_brand_kicker', label: '브랜드 작은 제목' },
      { key: 'home_brand_title_1', label: '브랜드 제목 1줄' },
      { key: 'home_brand_title_2', label: '브랜드 제목 2줄' },
      { key: 'home_brand_description', label: '브랜드 설명', multiline: true },
      { key: 'home_brand_cta', label: '브랜드 버튼' },
      { key: 'home_collection_kicker', label: '컬렉션 작은 제목' },
      { key: 'home_collection_title', label: '컬렉션 제목' },
      { key: 'home_collection_necklaces_title', label: '목걸이 카드 영문' },
      { key: 'home_collection_necklaces_subtitle', label: '목걸이 카드 한글' },
      { key: 'home_collection_earrings_title', label: '귀걸이 카드 영문' },
      { key: 'home_collection_earrings_subtitle', label: '귀걸이 카드 한글' },
      { key: 'home_collection_rings_title', label: '반지 카드 영문' },
      { key: 'home_collection_rings_subtitle', label: '반지 카드 한글' },
      { key: 'home_collection_bracelets_title', label: '팔찌 카드 영문' },
      { key: 'home_collection_bracelets_subtitle', label: '팔찌 카드 한글' },
    ],
  },
  {
    id: 'signature',
    title: '추천 / 시그니처',
    description: '추천 제품 영역과 시그니처 섹션의 문구입니다. 제품 노출은 제품 관리에서 조정합니다.',
    fields: [
      { key: 'home_recommended_kicker', label: '추천 제품 작은 제목' },
      { key: 'home_recommended_title', label: '추천 제품 제목' },
      { key: 'home_signature_kicker', label: '시그니처 작은 제목' },
      { key: 'home_signature_title_1', label: '시그니처 제목 1줄' },
      { key: 'home_signature_title_2', label: '시그니처 제목 2줄' },
      { key: 'home_signature_description', label: '시그니처 설명', multiline: true },
      { key: 'home_signature_cta', label: '시그니처 버튼' },
    ],
  },
  {
    id: 'consult',
    title: '상담 / 하단',
    description: '상담 유도 섹션과 푸터 브랜드 문구입니다.',
    fields: [
      { key: 'home_consult_kicker', label: '상담 작은 제목' },
      { key: 'home_consult_title_1', label: '상담 제목 1줄' },
      { key: 'home_consult_title_2', label: '상담 제목 2줄' },
      { key: 'home_consult_description', label: '상담 설명', multiline: true },
      { key: 'home_consult_cta', label: '상담 버튼' },
      { key: 'home_consult_feature_1_title', label: '하단 항목 1 제목' },
      { key: 'home_consult_feature_1_description', label: '하단 항목 1 설명' },
      { key: 'home_consult_feature_2_title', label: '하단 항목 2 제목' },
      { key: 'home_consult_feature_2_description', label: '하단 항목 2 설명' },
      { key: 'home_consult_feature_3_title', label: '하단 항목 3 제목' },
      { key: 'home_consult_feature_3_description', label: '하단 항목 3 설명' },
      { key: 'home_footer_note', label: '푸터 브랜드 문구', multiline: true },
    ],
  },
]

const inputClass =
  'min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-3 text-[15px] text-stone-950 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200/80'

const textareaClass =
  'w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-[15px] leading-7 text-stone-950 outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-200/80'

export default function AdminHomePage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_HOME_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' })
      if (response.ok) {
        const payload = (await response.json()) as { settings?: Settings }
        setSettings({ ...DEFAULT_HOME_SETTINGS, ...(payload.settings ?? {}) })
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
      setSettings({ ...DEFAULT_HOME_SETTINGS, ...(payload.settings ?? settings) })
      setMessage('저장 완료. 홈페이지에 바로 반영됩니다.')
    } else {
      setMessage('저장 실패. 잠시 후 다시 시도해 주세요.')
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return <p className="mx-auto max-w-2xl p-6 text-[16px] text-stone-500">불러오는 중입니다…</p>
  }

  return (
    <form className="mx-auto max-w-2xl pb-28" onSubmit={onSubmit}>
      <Link
        href="/"
        target="_blank"
        className="mb-4 inline-flex min-h-[46px] items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 text-[15px] font-semibold text-stone-700 transition hover:border-stone-400"
      >
        실제 홈페이지 미리보기
        <ExternalLink size={16} />
      </Link>

      <div className="space-y-5">
        {SECTIONS.map((section, index) => (
          <section key={section.id} className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
            <h2 className="text-[18px] font-bold tracking-tight text-stone-950">
              {index + 1}. {section.title}
            </h2>
            <p className="mt-1 text-[14px] leading-6 text-stone-500">{section.description}</p>
            <div className="mt-4 space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-[15px] font-semibold text-stone-800">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(event) => updateSetting(field.key, event.target.value)}
                      rows={2}
                      className={textareaClass}
                    />
                  ) : (
                    <input
                      value={settings[field.key] || ''}
                      onChange={(event) => updateSetting(field.key, event.target.value)}
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
