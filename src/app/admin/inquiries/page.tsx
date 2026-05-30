'use client'


import { useEffect, useMemo, useState } from 'react'
import { PhoneCall } from 'lucide-react'

type Inquiry = {
  id: number
  companyName: string
  phone: string
  interest: string | null
  message: string | null
  status: 'pending' | 'contacted' | 'completed'
  createdAt: string
}

const STATUS_OPTIONS: Array<{ value: Inquiry['status']; label: string }> = [
  { value: 'pending', label: '대기' },
  { value: 'contacted', label: '연락' },
  { value: 'completed', label: '완료' },
]

const STATUS_PRIORITY: Record<Inquiry['status'], number> = {
  pending: 0,
  contacted: 1,
  completed: 2,
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<'all' | Inquiry['status']>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const load = async () => {
    const response = await fetch('/api/admin/inquiries', { cache: 'no-store' })
    if (response.ok) {
      const payload = (await response.json()) as { inquiries?: Inquiry[] }
      setInquiries(payload.inquiries ?? [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const updateStatus = async (id: number, status: Inquiry['status']) => {
    setUpdatingId(id)
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) await load()
    } finally {
      setUpdatingId(null)
    }
  }

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      pending: inquiries.filter((item) => item.status === 'pending').length,
      contacted: inquiries.filter((item) => item.status === 'contacted').length,
      completed: inquiries.filter((item) => item.status === 'completed').length,
    }),
    [inquiries]
  )

  const sortedInquiries = useMemo(
    () =>
      inquiries
        .filter((item) => (filter === 'all' ? true : item.status === filter))
        .sort(
          (a, b) =>
            STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [filter, inquiries]
  )

  return (
    <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="rounded-[24px] border border-stone-200 bg-white p-3 lg:min-h-0 lg:overflow-y-auto">
        {[
          { value: 'all', label: '전체', count: counts.all },
          { value: 'pending', label: '바로 연락', count: counts.pending },
          { value: 'contacted', label: '연락 완료', count: counts.contacted },
          { value: 'completed', label: '처리 완료', count: counts.completed },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value as typeof filter)}
            className={`mb-2 flex min-h-[56px] w-full items-center justify-between rounded-2xl px-4 text-left transition active:translate-y-px ${
              filter === item.value ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="text-[15px] font-semibold">{item.label}</span>
            <span className={`text-lg font-semibold ${filter === item.value ? 'text-white' : 'text-stone-950'}`}>{item.count}</span>
          </button>
        ))}
      </aside>

      <section className="rounded-[24px] border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">문의 목록</h2>
            <p className="mt-1 text-[14px] text-stone-500">전화 후 상태만 바꾸면 됩니다.</p>
          </div>
          <p className="text-sm font-semibold text-stone-500">{sortedInquiries.length}건</p>
        </div>

        <div className="divide-y divide-stone-200 lg:max-h-[calc(100dvh-185px)] lg:overflow-y-auto">
          {isLoading ? (
            <p className="p-5 text-[15px] text-stone-500">불러오는 중입니다.</p>
          ) : sortedInquiries.length === 0 ? (
            <p className="p-5 text-[15px] text-stone-500">표시할 문의가 없습니다.</p>
          ) : (
            sortedInquiries.map((inquiry) => (
              <article key={inquiry.id} className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-lg font-semibold tracking-tight text-stone-950">{inquiry.companyName}</h3>
                    {inquiry.interest ? (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                        {inquiry.interest}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[13px] text-stone-400">{new Date(inquiry.createdAt).toLocaleString('ko-KR')}</p>
                  {inquiry.message ? (
                    <p className="mt-3 whitespace-pre-line break-words text-[15px] leading-7 text-stone-700">{inquiry.message}</p>
                  ) : (
                    <p className="mt-3 text-[15px] text-stone-400">문의 내용 없음</p>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-[1fr_240px] xl:grid-cols-1">
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 text-[15px] font-semibold text-white transition active:translate-y-px hover:bg-stone-700"
                  >
                    <PhoneCall size={18} />
                    전화 걸기
                    <span className="text-white/60">{inquiry.phone}</span>
                  </a>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => void updateStatus(inquiry.id, option.value)}
                        disabled={updatingId === inquiry.id}
                        className={`min-h-[54px] rounded-2xl text-[15px] font-semibold transition active:translate-y-px disabled:opacity-60 ${
                          inquiry.status === option.value
                            ? 'bg-stone-900 text-white'
                            : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
