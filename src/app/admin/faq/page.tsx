'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CircleHelp, Save, Trash2 } from 'lucide-react'
import { DEFAULT_FAQ_CATEGORIES, DEFAULT_FAQS, FaqItem, parseFaqItems } from '@/lib/faq'

type Settings = Record<string, string>

const initialForm: Omit<FaqItem, 'id'> = {
  category: 'order',
  question: '',
  answer: '',
}

const categoryOptions = DEFAULT_FAQ_CATEGORIES.filter((category) => category.id !== 'all')

function categoryName(id: string): string {
  return DEFAULT_FAQ_CATEGORIES.find((item) => item.id === id)?.name ?? '질문'
}

export default function AdminFaqPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const selectedFaq = useMemo(() => faqs.find((item) => item.id === selectedId) ?? null, [faqs, selectedId])

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' })
      if (!response.ok) return
      const payload = (await response.json()) as { settings?: Settings }
      const nextSettings = payload.settings ?? {}
      setSettings(nextSettings)
      setFaqs(parseFaqItems(nextSettings.faq_items))
    }
    void load()
  }, [])

  const editFaq = (faq: FaqItem) => {
    setSelectedId(faq.id)
    setForm({ category: faq.category, question: faq.question, answer: faq.answer })
    setMessage('')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setSelectedId(null)
    setForm(initialForm)
    setMessage('')
  }

  const saveAll = async (nextFaqs: FaqItem[], successMessage: string) => {
    setIsSaving(true)
    setMessage('')
    const nextSettings = { ...settings, faq_items: JSON.stringify(nextFaqs) }
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: nextSettings }),
    })
    if (response.ok) {
      const payload = (await response.json()) as { settings?: Settings }
      setSettings(payload.settings ?? nextSettings)
      setFaqs(nextFaqs)
      setMessage(successMessage)
    } else {
      setMessage('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
    setIsSaving(false)
    return response.ok
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) {
      setMessage('질문과 답변을 모두 입력해 주세요.')
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
    const ok = await saveAll(nextFaqs, selectedId ? '질문을 수정했습니다.' : '질문을 추가했습니다.')
    if (ok) resetForm()
  }

  const deleteFaq = async (faq: FaqItem) => {
    if (!window.confirm('이 질문을 삭제할까요?')) return
    const nextFaqs = faqs.filter((item) => item.id !== faq.id)
    if (selectedId === faq.id) resetForm()
    await saveAll(nextFaqs, '질문을 삭제했습니다.')
  }

  const inputClass =
    'min-h-[54px] w-full rounded-2xl border border-stone-300 bg-white px-4 text-[16px] outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 작성/수정 폼 */}
      <form className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6" onSubmit={onSubmit}>
        <h2 className="text-[20px] font-bold tracking-tight text-stone-950">
          {selectedFaq ? '질문 수정' : '새 질문 작성'}
        </h2>
        <p className="mt-1 text-[14px] text-stone-500">저장하면 FAQ 페이지에 바로 올라갑니다.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">분류</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className={inputClass}
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">질문</label>
            <input
              value={form.question}
              onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="예: 최소 주문 수량이 있나요?"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">답변</label>
            <textarea
              value={form.answer}
              onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
              rows={6}
              placeholder="답변 내용을 적어 주세요."
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-[16px] leading-8 outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
            />
          </div>

          {message ? (
            <p
              className={`rounded-2xl px-4 py-3 text-[15px] ${
                message.includes('실패') || message.includes('입력')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-[17px] font-bold text-white transition active:translate-y-px disabled:opacity-60"
            >
              <Save size={19} />
              {isSaving ? '저장 중…' : selectedFaq ? '수정 저장' : '질문 추가'}
            </button>
            {selectedFaq ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-stone-300 px-5 text-[16px] font-semibold text-stone-700 transition active:translate-y-px hover:bg-stone-50"
              >
                새 질문으로
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {/* 목록 */}
      <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <CircleHelp size={20} strokeWidth={2} className="text-stone-500" />
          <h2 className="text-[18px] font-bold tracking-tight text-stone-950">등록된 질문 ({faqs.length})</h2>
        </div>
        {faqs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-[15px] text-stone-500">아직 등록된 질문이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {faqs.map((faq) => (
              <li key={faq.id} className="rounded-2xl border border-stone-200 p-4">
                <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[12px] font-semibold text-stone-600">
                  {categoryName(faq.category)}
                </span>
                <p className="mt-2 text-[16px] font-semibold text-stone-950">{faq.question}</p>
                <p className="mt-1 line-clamp-2 text-[14px] leading-6 text-stone-500">{faq.answer}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => editFaq(faq)}
                    className="min-h-[48px] rounded-xl bg-stone-900 text-[15px] font-semibold text-white transition active:translate-y-px"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteFaq(faq)}
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
