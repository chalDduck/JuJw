import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell, ChevronRight, Pin } from 'lucide-react'
import { getNotices } from '@/lib/db'

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

function isRecent(iso: string): boolean {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return false
  return Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000
}

function excerpt(content: string, length = 100): string {
  const text = content.replace(/\s+/g, ' ').trim()
  return text.length > length ? `${text.slice(0, length)}…` : text
}

type NoticeCardData = {
  id: number
  title: string
  content: string
  isPinned: boolean
  createdAt: string
}

function NoticeCard({ notice, pinned = false }: { notice: NoticeCardData; pinned?: boolean }) {
  const recent = isRecent(notice.createdAt)
  return (
    <Link
      href={`/notices/${notice.id}`}
      className={`group relative block overflow-hidden rounded-3xl border p-5 transition-all duration-300 sm:p-6 ${
        pinned
          ? 'border-[#d8c2a4] bg-[#fbf4ea] hover:border-[#b9925f]'
          : 'border-[#e5dccf] bg-white hover:border-[#c7ad8b] hover:shadow-[0_18px_40px_-28px_rgba(72,52,33,0.45)]'
      }`}
    >
      {pinned ? <span className="absolute inset-y-0 left-0 w-1.5 bg-[#b9925f]" /> : null}

      <div className="flex items-center gap-2">
        {pinned ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4b382d] px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-[#f5e3cb]">
            <Pin size={12} strokeWidth={2.2} />
            중요
          </span>
        ) : null}
        {recent ? (
          <span className="inline-flex items-center rounded-full bg-[#b9925f] px-2.5 py-1 text-[11px] font-bold tracking-[0.04em] text-white">
            NEW
          </span>
        ) : null}
        <time className="text-[13px] font-medium text-[#a08a76]">{formatDate(notice.createdAt)}</time>
      </div>

      <h2 className="mt-3 text-[19px] font-semibold leading-7 text-[#2f241d] sm:text-[21px]">
        {notice.title}
      </h2>
      <p className="mt-2 line-clamp-2 text-[14px] leading-7 text-[#7a6a5c] sm:text-[15px]">
        {excerpt(notice.content)}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#8a6c4c] transition-colors group-hover:text-[#5a4337]">
        자세히 보기
        <ChevronRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export default async function NoticesPage() {
  const notices = await getNotices({ publishedOnly: true })
  const pinned = notices.filter((notice) => notice.isPinned)
  const regular = notices.filter((notice) => !notice.isPinned)

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#33261f]">
      {/* 헤더 */}
      <section className="public-hero px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4b382d] text-[#f3dcc0]">
            <Bell size={22} strokeWidth={1.8} />
          </span>
          <p className="mt-5 font-display text-[12px] uppercase tracking-[0.28em] text-[#a77c52]">Notice</p>
          <h1 className="mt-2 text-[2.2rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#2f241d] sm:text-[3.1rem]">
            공지사항
          </h1>
          <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[#6b5c4f] sm:text-[16px]">
            휴무 안내, 신상품 입고, 이벤트 소식을 이곳에서 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* 목록 */}
      <section className="px-4 pb-20 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          {notices.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d8c9b8] bg-white/60 py-20 text-center">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e7d9] text-[#b9925f]">
                <Bell size={24} strokeWidth={1.8} />
              </span>
              <p className="mt-4 text-[16px] font-medium text-[#6b5c4f]">아직 등록된 공지사항이 없습니다.</p>
              <p className="mt-1 text-[14px] text-[#9a8a7c]">새로운 소식이 준비되면 이곳에 안내해 드리겠습니다.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {pinned.length > 0 ? (
                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#a77c52]">
                    <Pin size={14} strokeWidth={2.2} />
                    중요 공지
                  </h2>
                  <div className="space-y-3">
                    {pinned.map((notice) => (
                      <NoticeCard key={notice.id} notice={notice} pinned />
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                {pinned.length > 0 ? (
                  <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#a77c52]">전체 소식</h2>
                ) : null}
                {regular.length > 0 ? (
                  <div className="space-y-3">
                    {regular.map((notice) => (
                      <NoticeCard key={notice.id} notice={notice} />
                    ))}
                  </div>
                ) : pinned.length > 0 ? (
                  <p className="rounded-3xl border border-dashed border-[#d8c9b8] bg-white/60 px-5 py-8 text-center text-[14px] text-[#9a8a7c]">
                    그 밖의 공지는 아직 없습니다.
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
