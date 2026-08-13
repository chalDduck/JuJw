'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Megaphone, Pin, Save, Trash2 } from 'lucide-react'

type Notice = {
  id: number
  title: string
  content: string
  isPublished: boolean
  isPinned: boolean
  createdAt: string
}

type NoticeForm = {
  title: string
  content: string
  isPublished: boolean
  isPinned: boolean
}

const emptyForm: NoticeForm = { title: '', content: '', isPublished: true, isPinned: false }

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<NoticeForm>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/notices', { cache: 'no-store' })
      if (res.ok) {
        const payload = (await res.json()) as { notices?: Notice[] }
        setNotices(payload.notices ?? [])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const resetForm = () => {
    setSelectedId(null)
    setForm(emptyForm)
    setError('')
    setMessage('')
  }

  const onEdit = (notice: Notice) => {
    setSelectedId(notice.id)
    setForm({
      title: notice.title,
      content: notice.content,
      isPublished: notice.isPublished,
      isPinned: notice.isPinned,
    })
    setError('')
    setMessage('')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!form.title.trim() || !form.content.trim()) {
      setError('제목과 내용을 모두 입력해 주세요.')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(selectedId ? `/api/admin/notices/${selectedId}` : '/api/admin/notices', {
        method: selectedId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          isPublished: form.isPublished,
          isPinned: form.isPinned,
        }),
      })
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(payload.error || '저장에 실패했습니다.')

      setMessage(selectedId ? '공지를 수정했습니다.' : '공지를 등록했습니다.')
      resetForm()
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async (notice: Notice) => {
    if (!window.confirm(`"${notice.title}" 공지를 삭제할까요?`)) return
    setError('')
    setMessage('')
    const res = await fetch(`/api/admin/notices/${notice.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string }
      setError(payload.error || '삭제에 실패했습니다.')
      return
    }
    if (selectedId === notice.id) resetForm()
    setMessage('공지를 삭제했습니다.')
    await load()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 작성/수정 폼 */}
      <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-[20px] font-bold tracking-tight text-stone-950">
          {selectedId ? '공지 수정' : '새 공지 작성'}
        </h2>
        <p className="mt-1 text-[16px] leading-7 text-stone-600">제목과 내용을 적고 저장 버튼을 누르면 홈페이지에 바로 올라갑니다.</p>

        <form className="mt-5 space-y-5" onSubmit={onSubmit}>
          <div>
            <label htmlFor="notice-title" className="mb-2 block text-[16px] font-semibold text-stone-800">제목</label>
            <input
              id="notice-title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="예: 설 연휴 휴무 안내"
              className="min-h-[58px] w-full rounded-2xl border border-stone-300 px-4 text-[16px] outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
            />
          </div>

          <div>
            <label htmlFor="notice-content" className="mb-2 block text-[16px] font-semibold text-stone-800">내용</label>
            <textarea
              id="notice-content"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={6}
              placeholder="공지 내용을 적어 주세요."
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-[16px] leading-8 outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ToggleButton
              active={form.isPublished}
              onClick={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
            >
              {form.isPublished ? '홈페이지에 보임' : '숨김 (안 보임)'}
            </ToggleButton>
            <ToggleButton
              active={form.isPinned}
              onClick={() => setForm((prev) => ({ ...prev, isPinned: !prev.isPinned }))}
              icon={<Pin size={18} strokeWidth={2} />}
            >
              {form.isPinned ? '맨 위 고정' : '고정 안 함'}
            </ToggleButton>
          </div>

          {error ? <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-[16px] font-semibold text-red-800">{error}</p> : null}
          {message ? <p role="status" aria-live="polite" className="rounded-2xl bg-emerald-50 px-4 py-3 text-[16px] font-semibold text-emerald-800">{message}</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-[16px] font-bold text-white transition active:translate-y-px disabled:opacity-60"
            >
              <Save size={18} />
              {isSaving ? '저장 중…' : selectedId ? '수정 저장' : '공지 올리기'}
            </button>
            {selectedId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-stone-300 px-5 text-[16px] font-semibold text-stone-700 transition active:translate-y-px hover:bg-stone-50"
              >
                새 공지로
              </button>
            ) : null}
          </div>
        </form>
      </section>

      {/* 공지 목록 */}
      <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone size={20} strokeWidth={2} className="text-stone-500" />
          <h2 className="text-[18px] font-bold tracking-tight text-stone-950">올린 공지 ({notices.length})</h2>
        </div>

        {isLoading ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-[15px] text-stone-500">불러오는 중입니다…</p>
        ) : notices.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-[15px] text-stone-500">아직 올린 공지가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {notices.map((notice) => (
              <li key={notice.id} className="rounded-2xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      {notice.isPinned ? (
                        <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[14px] font-semibold text-white">고정</span>
                      ) : null}
                      <span
                        className={`rounded-full px-2.5 py-1 text-[14px] font-semibold ${
                          notice.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-[#3f3a36]'
                        }`}
                      >
                        {notice.isPublished ? '보임' : '숨김'}
                      </span>
                      <span className="text-[15px] text-stone-600">{formatDate(notice.createdAt)}</span>
                    </div>
                    <p className="truncate text-[16px] font-semibold text-stone-950">{notice.title}</p>
                    <p className="mt-1 line-clamp-2 text-[15px] leading-7 text-stone-600">{notice.content}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(notice)}
                    className="min-h-[48px] rounded-xl bg-stone-900 text-[15px] font-semibold text-white transition active:translate-y-px"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(notice)}
                    className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-red-200 text-[15px] font-semibold text-red-600 transition active:translate-y-px hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-2xl px-3 text-[15px] font-semibold transition active:translate-y-px ${
        active ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-600'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
