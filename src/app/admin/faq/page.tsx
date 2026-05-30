'use client'


import { FormEvent, useEffect, useMemo, useState } from 'react'
import { DEFAULT_FAQ_CATEGORIES, DEFAULT_FAQS, FaqItem, parseFaqItems } from '@/lib/faq'

type Settings = Record<string, string>

const initialForm: Omit<FaqItem, 'id'> = {
  category: 'order',
  question: '',
  answer: '',
}

export default function AdminFaqPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)
  const [selectedId, setSelectedId] = useState<number | null>(DEFAULT_FAQS[0]?.id ?? null)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const selectedFaq = useMemo(
    () => faqs.find((item) => item.id === selectedId) ?? null,
    [faqs, selectedId]
  )

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' })
      if (!response.ok) return

      const payload = (await response.json()) as { settings?: Settings }
      const nextSettings = payload.settings ?? {}
      const nextFaqs = parseFaqItems(nextSettings.faq_items)
      setSettings(nextSettings)
      setFaqs(nextFaqs)
      setSelectedId(nextFaqs[0]?.id ?? null)
      if (nextFaqs[0]) {
        setForm({
          category: nextFaqs[0].category,
          question: nextFaqs[0].question,
          answer: nextFaqs[0].answer,
        })
      }
    }

    void load()
  }, [])

  const selectFaq = (faq: FaqItem) => {
    setSelectedId(faq.id)
    setForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
    })
    setMessage('')
  }

  const newFaq = () => {
    setSelectedId(null)
    setForm(initialForm)
    setMessage('')
  }

  const saveAll = async (nextFaqs: FaqItem[]) => {
    setIsSaving(true)
    setMessage('')

    const nextSettings = {
      ...settings,
      faq_items: JSON.stringify(nextFaqs),
    }

    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: nextSettings }),
    })

    if (response.ok) {
      const payload = (await response.json()) as { settings?: Settings }
      setSettings(payload.settings ?? nextSettings)
      setFaqs(nextFaqs)
      setMessage('저장되었습니다. FAQ 페이지에 바로 반영됩니다.')
    } else {
      setMessage('저장에 실패했습니다.')
    }

    setIsSaving(false)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) {
      setMessage('질문과 답변을 입력해 주세요.')
      return
    }

    const nextItem: FaqItem = {
      id: selectedId ?? Math.max(0, ...faqs.map((item) => item.id)) + 1,
      category: form.category,
      question: form.question.trim(),
      answer: form.answer.trim(),
    }

    const nextFaqs = selectedId
      ? faqs.map((item) => (item.id === selectedId ? nextItem : item))
      : [...faqs, nextItem]

    setSelectedId(nextItem.id)
    await saveAll(nextFaqs)
  }

  const deleteFaq = async () => {
    if (!selectedFaq) return
    if (!window.confirm('이 질문을 삭제하시겠습니까?')) return

    const nextFaqs = faqs.filter((item) => item.id !== selectedFaq.id)
    const nextSelected = nextFaqs[0] ?? null
    setSelectedId(nextSelected?.id ?? null)
    setForm(nextSelected ? {
      category: nextSelected.category,
      question: nextSelected.question,
      answer: nextSelected.answer,
    } : initialForm)
    await saveAll(nextFaqs)
  }

  return (
    <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[420px_minmax(0,1fr)]">
      <section className="border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">FAQ 목록</h2>
            <p className="mt-1 text-[14px] text-stone-500">공개 FAQ 페이지와 직접 연결됩니다.</p>
          </div>
          <button
            type="button"
            onClick={newFaq}
            className="min-h-[42px] border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            새 질문
          </button>
        </div>

        <div data-admin-table className="divide-y divide-stone-200 lg:max-h-[calc(100dvh-180px)] lg:overflow-y-auto">
          {faqs.map((faq, index) => {
            const active = faq.id === selectedId
            const category = DEFAULT_FAQ_CATEGORIES.find((item) => item.id === faq.category)?.name ?? '질문'

            return (
              <button
                key={faq.id}
                type="button"
                onClick={() => selectFaq(faq)}
                className={`grid w-full grid-cols-[52px_minmax(0,1fr)_86px] gap-3 px-4 py-3 text-left transition ${
                  active ? 'bg-stone-900 text-white' : 'hover:bg-stone-50'
                }`}
              >
                <span className={`text-[13px] font-semibold ${active ? 'text-white/60' : 'text-stone-400'}`}>
                  Q{String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 truncate text-[15px] font-semibold">{faq.question}</span>
                <span className={`text-right text-[13px] ${active ? 'text-white/60' : 'text-stone-500'}`}>
                  {category}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <form className="border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden" onSubmit={onSubmit}>
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              {selectedFaq ? '질문 수정' : '새 질문 작성'}
            </h2>
            <p className="mt-1 text-[14px] text-stone-500">질문과 답변을 저장하면 `/faq`에 바로 반영됩니다.</p>
          </div>
          <div className="flex gap-2">
            {selectedFaq ? (
              <button
                type="button"
                onClick={() => void deleteFaq()}
                className="min-h-[42px] border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-[42px] bg-stone-900 px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? '저장 중' : '저장'}
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4 lg:max-h-[calc(100dvh-180px)] lg:overflow-y-auto">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-stone-800">분류</label>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="min-h-[48px] w-full border border-stone-300 px-3 text-[15px]"
            >
              {DEFAULT_FAQ_CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-stone-800">질문</label>
            <input
              value={form.question}
              onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
              className="min-h-[48px] w-full border border-stone-300 px-3 text-[15px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-semibold text-stone-800">답변</label>
            <textarea
              value={form.answer}
              onChange={(event) => setForm((prev) => ({ ...prev, answer: event.target.value }))}
              rows={9}
              className="w-full border border-stone-300 px-3 py-3 text-[15px] leading-7"
            />
          </div>

          {message ? (
            <p className={`border px-4 py-3 text-[14px] ${message.includes('실패') || message.includes('입력') ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}
