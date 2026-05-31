import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getNotices, getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import NoticesShell from '@/components/notices/NoticesShell'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '공지사항',
  description: 'Ju Jewelry의 휴무, 신상품 입고, 이벤트 등 최신 소식을 확인하세요.',
  alternates: { canonical: '/notices' },
}

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

  return (
    <NoticesShell
      settings={settings}
      heroTitle="공지사항"
      heroSubtitle="휴무 안내, 신상품 입고, 이벤트 소식을 이곳에서 확인하실 수 있습니다."
    >
      {notices.length === 0 ? (
        <div className="border-y border-[#dfd0bf] py-20 text-center">
          <p className="text-[16px] text-[#6b5c4f]">아직 등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <ul className="border-t border-[#d8c9b8]">
          {notices.map((notice) => (
            <li key={notice.id} className="border-b border-[#dfd0bf]">
              <Link
                href={`/notices/${notice.id}`}
                className="group flex items-start gap-4 py-6 transition-colors hover:bg-[#f1e7d9]/40 sm:gap-6 sm:py-7"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {notice.isPinned ? (
                      <span className="inline-flex items-center rounded-full bg-[#4b382d] px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-[#f5e3cb]">
                        중요
                      </span>
                    ) : null}
                    <time className="text-[13px] text-[#9a8a7c]">{formatDate(notice.createdAt)}</time>
                  </div>
                  <h2 className="text-[18px] font-semibold leading-7 text-[#2f241d] sm:text-[20px]">
                    {notice.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#6b5c4f]">{excerpt(notice.content)}</p>
                </div>
                <ArrowRight
                  size={20}
                  strokeWidth={1.7}
                  className="mt-1 shrink-0 text-[#b59a7c] transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </NoticesShell>
  )
}
