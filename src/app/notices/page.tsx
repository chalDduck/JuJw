import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getNotices, getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import NoticesShell from '@/components/notices/NoticesShell'
import { buildPageMetadata } from '@/lib/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildPageMetadata({
  title: '공지사항',
  description: 'Ju Jewelry의 휴무, 신상품 입고, 이벤트 등 최신 소식을 확인하세요.',
  path: '/notices',
  image: '/img/notices-generated/notices-hero-desktop.png',
  imageAlt: 'JU JEWELRY 공지사항',
})

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function excerpt(content: string, length = 90): string {
  const text = content.replace(/\s+/g, ' ').trim()
  return text.length > length ? `${text.slice(0, length)}…` : text
}

export default async function NoticesPage() {
  const [settingsMap, notices] = await Promise.all([
    getPublicSettings(),
    getNotices({ publishedOnly: true }),
  ])
  const settings = normalizeSiteSettings(settingsMap)
  const pinnedCount = notices.filter((notice) => notice.isPinned).length
  const latestNotice = notices[0]

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '공지사항', path: '/notices' }]} />
      <NoticesShell
        settings={settings}
        heroTitle="공지사항"
        heroSubtitle="운영 안내와 신상품 소식, 이벤트 공지를 한곳에서 확인하세요."
        summaryItems={[
          { label: '등록된 공지', value: `${notices.length}건` },
          { label: '중요 안내', value: pinnedCount > 0 ? `${pinnedCount}건 확인 필요` : '현재 고정 공지는 없습니다' },
          { label: '최근 업데이트', value: latestNotice ? formatDate(latestNotice.createdAt) : '준비 중' },
        ]}
      >
        <div className="mb-7 flex flex-col gap-4 border-b border-[#dfd0bf] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#a77c52]">Latest Updates</p>
            <h2 className="mt-3 text-[1.85rem] font-semibold leading-tight tracking-[-0.04em] text-[#2f241d] sm:text-[2.35rem]">
              매장 소식
            </h2>
          </div>
          <p className="max-w-[420px] text-[14px] leading-7 text-[#6b5c4f] sm:text-right">
            방문 전 확인이 필요한 일정과 제품 관련 안내를 최신순으로 정리했습니다.
          </p>
        </div>

        {notices.length === 0 ? (
          <div className="border-y border-[#dfd0bf] bg-[#fbf8f4] px-4 py-20 text-center">
            <p className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[#2f241d]">아직 등록된 공지사항이 없습니다</p>
            <p className="mt-3 text-[14px] leading-7 text-[#6b5c4f]">
              새로운 운영 안내가 생기면 이곳에 먼저 정리해 두겠습니다.
            </p>
          </div>
        ) : (
          <ul className="border-y border-[#d8c9b8] bg-[#fbf8f4]">
            {notices.map((notice) => (
              <li key={notice.id} className="border-b border-[#dfd0bf] last:border-b-0">
                <Link
                  href={`/notices/${notice.id}`}
                  className="group grid gap-4 px-4 py-6 transition-colors last:border-b-0 hover:bg-white sm:grid-cols-[168px_1fr_auto] sm:items-start sm:px-5 sm:py-7 md:grid-cols-[190px_1fr_80px]"
                >
                  <div className="flex items-center gap-2 sm:block">
                    {notice.isPinned ? (
                      <span className="inline-flex items-center bg-[#4b382d] px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-[#f5e3cb]">
                        중요
                      </span>
                    ) : (
                      <span className="hidden text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b59a7c] sm:inline">
                        Notice
                      </span>
                    )}
                    <time className="text-[13px] text-[#9a8a7c] sm:mt-3 sm:block">{formatDate(notice.createdAt)}</time>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[1.15rem] font-semibold leading-7 tracking-[-0.03em] text-[#2f241d] sm:text-[1.35rem]">
                      {notice.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#6b5c4f]">{excerpt(notice.content)}</p>
                  </div>
                  <ArrowRight
                    size={20}
                    strokeWidth={1.7}
                    className="hidden shrink-0 justify-self-end text-[#b59a7c] transition-transform duration-300 group-hover:translate-x-1 sm:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </NoticesShell>
    </>
  )
}
