'use client'


import { FormEvent, useEffect, useMemo, useState } from 'react'
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
  const [selectedId, setSelectedId] = useState(SECTIONS[0].id)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const selectedSection = useMemo(
    () => SECTIONS.find((section) => section.id === selectedId) ?? SECTIONS[0],
    [selectedId]
  )

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

  return (
    <form className="lg:h-full lg:min-h-0" onSubmit={onSubmit}>
      <div className="mb-3 flex flex-col gap-3 border-b border-stone-200 pb-3 sm:flex-row sm:items-center sm:justify-between lg:hidden">
        <div>
          <p className="text-sm font-semibold text-stone-500">홈페이지 편집</p>
          <p className="text-[13px] leading-6 text-stone-500">저장 후 공개 홈에 바로 반영됩니다.</p>
        </div>
        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-[15px] font-semibold text-white transition active:translate-y-px disabled:opacity-60"
        >
          <Save size={17} />
          {isSaving ? '저장 중' : '저장'}
        </button>
      </div>

      <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[210px_minmax(0,1fr)_330px]">
        <aside className="min-w-0 lg:min-h-0">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:block lg:h-full lg:overflow-y-auto lg:pb-0">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedId(section.id)}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition active:translate-y-px lg:mb-2 lg:block lg:w-full ${
                  selectedId === section.id
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                <span className="block text-[15px] font-semibold">{section.title}</span>
                <span className={`mt-1 hidden text-[12px] leading-5 lg:block ${selectedId === section.id ? 'text-white/60' : 'text-stone-500'}`}>
                  {section.fields.length}개 항목
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 rounded-[24px] border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-stone-200 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-stone-950">{selectedSection.title}</h2>
              <p className="mt-1 text-[14px] leading-6 text-stone-500">{selectedSection.description}</p>
            </div>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="hidden min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-sm font-semibold text-white transition active:translate-y-px disabled:opacity-60 lg:inline-flex"
            >
              <Save size={16} />
              {isSaving ? '저장 중' : '저장'}
            </button>
          </div>

          {isLoading ? (
            <p className="p-5 text-[15px] text-stone-500">불러오는 중입니다.</p>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:max-h-[calc(100dvh-185px)] lg:overflow-y-auto">
              {selectedSection.fields.map((field) => (
                <div key={field.key} className={field.multiline ? 'sm:col-span-2' : undefined}>
                  <label className="mb-2 block text-[14px] font-semibold text-stone-800">{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(event) => updateSetting(field.key, event.target.value)}
                      rows={3}
                      className={textareaClass}
                    />
                  ) : (
                    <input
                      value={settings[field.key] || ''}
                      onChange={(event) => updateSetting(field.key, event.target.value)}
                      className={inputClass}
                    />
                  )}
                  {field.helper ? <p className="mt-1 text-[12px] leading-5 text-stone-500">{field.helper}</p> : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="min-w-0 rounded-[24px] border border-stone-200 bg-[#211a16] p-5 text-white lg:min-h-0 lg:overflow-y-auto">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">미리보기</h3>
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              실제 홈
              <ExternalLink size={14} />
            </Link>
          </div>

          <div className="mt-5 space-y-5 text-sm leading-6">
            <section className="border-b border-white/10 pb-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">Hero</p>
              <p className="mt-3 text-2xl font-semibold leading-tight">{settings.home_hero_line_1}</p>
              <p className="text-2xl font-semibold leading-tight">{settings.home_hero_line_2}</p>
              <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-950">
                {settings.home_hero_cta}
              </p>
            </section>

            <section className="border-b border-white/10 pb-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">Benefits</p>
              <div className="mt-3 space-y-3">
                {[1, 2, 3, 4].map((number) => (
                  <div key={number}>
                    <p className="font-semibold">{settings[`home_benefit_${number}_title`]}</p>
                    <p className="text-white/55">{settings[`home_benefit_${number}_description`]}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-b border-white/10 pb-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">{settings.home_collection_kicker}</p>
              <p className="mt-2 text-xl font-semibold">{settings.home_collection_title}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {[
                  ['home_collection_necklaces_title', 'home_collection_necklaces_subtitle'],
                  ['home_collection_earrings_title', 'home_collection_earrings_subtitle'],
                  ['home_collection_rings_title', 'home_collection_rings_subtitle'],
                  ['home_collection_bracelets_title', 'home_collection_bracelets_subtitle'],
                ].map(([titleKey, subtitleKey]) => (
                  <div key={titleKey} className="rounded-xl bg-white/10 p-3">
                    <p className="font-semibold">{settings[titleKey]}</p>
                    <p className="text-white/55">{settings[subtitleKey]}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">{settings.home_consult_kicker}</p>
              <p className="mt-2 text-xl font-semibold leading-tight">{settings.home_consult_title_1}</p>
              <p className="text-xl font-semibold leading-tight">{settings.home_consult_title_2}</p>
              <p className="mt-3 text-white/60">{settings.home_consult_description}</p>
            </section>
          </div>

          {message ? (
            <p
              className={`mt-5 rounded-2xl px-4 py-3 text-[13px] leading-6 ${
                message.includes('실패') ? 'bg-red-500/15 text-red-100' : 'bg-emerald-500/15 text-emerald-100'
              }`}
            >
              {message}
            </p>
          ) : null}
        </aside>
      </div>
    </form>
  )
}
