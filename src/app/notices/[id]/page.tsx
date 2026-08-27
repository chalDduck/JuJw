import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getNoticeById, getPublicSettings } from '@/lib/public-data'
import { normalizeSiteSettings } from '@/lib/site-settings'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import NoticesShell from '@/components/notices/NoticesShell'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number(params.id)
  const notice = id ? await getNoticeById(id) : null
  if (!notice || !notice.isPublished) {
    return { title: '공지사항' }
  }
  return buildPageMetadata({
    title: notice.title,
    description: notice.content.replace(/\s+/g, ' ').trim().slice(0, 120),
    path: `/notices/${notice.id}`,
    image: '/img/notices-generated/notices-hero-desktop.png',
    imageAlt: notice.title,
  })
}

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const [settingsMap, notice] = await Promise.all([
    getPublicSettings(),
    id ? getNoticeById(id) : Promise.resolve(null),
  ])

  if (!notice || !notice.isPublished) {
    notFound()
  }

  const settings = normalizeSiteSettings(settingsMap)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '공지사항', path: '/notices' },
          { name: notice.title, path: `/notices/${notice.id}` },
        ]}
      />
      <NoticesShell
        settings={settings}
        heroTitle="공지사항"
        heroSubtitle="확인이 필요한 매장 안내를 편안하게 읽을 수 있도록 정리했습니다."
        summaryItems={[
          { label: '공지 구분', value: notice.isPinned ? '중요 안내' : '일반 안내' },
          { label: '작성일', value: formatDate(notice.createdAt) },
          { label: '문의', value: settings.phonePrimary },
        ]}
        contentWidth="narrow"
      >
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#8a7256] transition-colors hover:text-[#5a4337]"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          공지사항 목록
        </Link>

        <div className="mt-6 flex items-center gap-2">
          {notice.isPinned ? (
            <span className="inline-flex items-center rounded-full bg-[#4b382d] px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-[#f5e3cb]">
              중요
            </span>
          ) : null}
          <time className="text-[13px] text-[#9a8a7c]">{formatDate(notice.createdAt)}</time>
        </div>

        <h2 className="mt-4 text-[1.85rem] font-semibold leading-[1.28] tracking-[-0.04em] text-[#2f241d] sm:text-[2.7rem]">
          {notice.title}
        </h2>

        <div className="mt-8 h-px w-full bg-[#dfd0bf]" />

        <article className="mt-8 whitespace-pre-wrap text-[16px] leading-9 text-[#42342b] sm:text-[17px] sm:leading-10">
          {notice.content}
        </article>

        <div className="mt-14 border-t border-[#dfd0bf] pt-8">
          <Link
            href="/contact"
            className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[#3d2d24] px-7 text-[14px] font-semibold tracking-[0.06em] text-white transition-colors hover:bg-[#2f241d]"
          >
            문의하기
          </Link>
        </div>
      </NoticesShell>
    </>
  )
}
