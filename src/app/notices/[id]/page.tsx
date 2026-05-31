import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ChevronRight, List, Pin } from 'lucide-react'
import { getNoticeById } from '@/lib/db'

export const dynamic = 'force-dynamic'

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

function isRecent(iso: string): boolean {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return false
  return Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number(params.id)
  const notice = id ? await getNoticeById(id) : null
  if (!notice || !notice.isPublished) {
    return { title: '공지사항' }
  }
  return {
    title: notice.title,
    description: notice.content.replace(/\s+/g, ' ').trim().slice(0, 120),
    alternates: { canonical: `/notices/${notice.id}` },
  }
}

export default async function NoticeDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const notice = id ? await getNoticeById(id) : null

  if (!notice || !notice.isPublished) {
    notFound()
  }

  const recent = isRecent(notice.createdAt)

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#33261f]">
      <article className="public-hero px-4 pb-20 sm:px-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8a7256] transition-colors hover:text-[#5a4337]"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            공지사항 목록
          </Link>

          {/* 제목 카드 */}
          <header className="mt-5 overflow-hidden rounded-3xl border border-[#e5dccf] bg-white">
            <div className="border-b border-[#efe5d8] bg-[#fbf4ea] px-6 py-6 sm:px-8 sm:py-7">
              <div className="flex flex-wrap items-center gap-2">
                {notice.isPinned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#4b382d] px-2.5 py-1 text-[11px] font-semibold text-[#f5e3cb]">
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
              <h1 className="mt-3 text-[1.7rem] font-semibold leading-[1.32] tracking-[-0.02em] text-[#2f241d] sm:text-[2.3rem]">
                {notice.title}
              </h1>
            </div>

            {/* 본문 */}
            <div className="px-6 py-7 sm:px-8 sm:py-9">
              <div className="whitespace-pre-wrap text-[16px] leading-9 text-[#42342b] sm:text-[17px]">
                {notice.content}
              </div>
            </div>
          </header>

          {/* 하단 액션 */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/notices"
              className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[#cdbba8] bg-white px-6 text-[15px] font-semibold text-[#4b382d] transition-colors hover:border-[#8d6a49] hover:text-[#8d6a49]"
            >
              <List size={17} strokeWidth={2} />
              목록으로
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[54px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#3d2d24] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#2f241d]"
            >
              문의하기
              <ChevronRight size={17} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
