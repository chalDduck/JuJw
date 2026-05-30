'use client'

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent, ReactNode, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Camera, ImagePlus, Save, Search, Trash2 } from 'lucide-react'

type Category = {
  id: number
  name: string
  slug: string
}

type ProductImage = {
  id: number
  productId: number
  url: string
  altText: string | null
  isPrimary: boolean
  orderIndex: number
}

type Product = {
  id: number
  categoryId: number
  categoryName?: string
  categorySlug?: string
  name: string
  slug: string
  spec: string | null
  description: string | null
  isFeatured: boolean
  isPublished: boolean
  imageUrl: string | null
  updatedAt: string
  images?: ProductImage[]
}

type ProductForm = {
  categoryId: string
  name: string
  spec: string
  description: string
  isFeatured: boolean
  isPublished: boolean
}

const initialForm: ProductForm = {
  categoryId: '',
  name: '',
  spec: '',
  description: '',
  isFeatured: false,
  isPublished: true,
}

function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || url.startsWith('products/')) {
    return '/img/hero/hero.png'
  }
  return url
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p className="p-6 text-[15px] text-stone-500">불러오는 중입니다…</p>}>
      <ProductsManager />
    </Suspense>
  )
}

function ProductsManager() {
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductForm>(initialForm)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const hydrateForm = (product: Product) => {
    setSelectedId(product.id)
    setForm({
      categoryId: String(product.categoryId),
      name: product.name,
      spec: product.spec ?? '',
      description: product.description ?? '',
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
    })
  }

  const load = async () => {
    setIsLoading(true)

    try {
      const [categoryRes, productRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
      ])

      if (categoryRes.ok) {
        const payload = (await categoryRes.json()) as { categories?: Category[] }
        setCategories(payload.categories ?? [])
      }

      if (productRes.ok) {
        const payload = (await productRes.json()) as { products?: Product[] }
        const nextProducts = payload.products ?? []
        setProducts(nextProducts)

        if (selectedId) {
          const found = nextProducts.find((item) => item.id === selectedId)
          if (found) {
            hydrateForm(found)
          }
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedId(null)
    setForm({
      ...initialForm,
      categoryId: categories[0] ? String(categories[0].id) : '',
    })
    setError('')
    setMessage('')
  }

  useEffect(() => {
    void load()
    // load is intentionally called once on mount; manual reloads run after mutations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!form.categoryId && categories[0]) {
      setForm((prev) => ({ ...prev, categoryId: String(categories[0].id) }))
    }
  }, [categories, form.categoryId])

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      resetForm()
    }
    // resetForm depends on loaded categories; this effect tracks URL/category changes only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories])

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId]
  )

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filterCategory !== 'all' && product.categorySlug !== filterCategory) return false
      if (visibilityFilter === 'published' && !product.isPublished) return false
      if (visibilityFilter === 'draft' && product.isPublished) return false

      const keyword = search.trim().toLowerCase()
      if (!keyword) return true

      return [product.name, product.spec ?? '', product.description ?? '']
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
  }, [filterCategory, products, search, visibilityFilter])

  const onSelectProduct = (product: Product) => {
    hydrateForm(product)
    setError('')
    setMessage('')
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!form.categoryId || !form.name.trim()) {
      setError('카테고리와 제품명은 필수입니다.')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(selectedId ? `/api/admin/products/${selectedId}` : '/api/admin/products', {
        method: selectedId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: Number(form.categoryId),
          name: form.name.trim(),
          spec: form.spec.trim(),
          description: form.description.trim(),
          isFeatured: form.isFeatured,
          isPublished: form.isPublished,
        }),
      })

      const payload = (await response.json()) as { error?: string; product?: Product }
      if (!response.ok || !payload.product) {
        throw new Error(payload.error || '저장에 실패했습니다.')
      }

      setMessage(selectedId ? '제품 정보가 저장되었습니다.' : '제품이 저장되었습니다. 사진을 추가할 수 있습니다.')
      await load()
      hydrateForm(payload.product)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const onDelete = async () => {
    if (!selectedProduct) return
    if (!window.confirm(`"${selectedProduct.name}" 제품을 삭제하시겠습니까?`)) return

    setError('')
    setMessage('')

    const response = await fetch(`/api/admin/products/${selectedProduct.id}`, { method: 'DELETE' })
    const payload = (await response.json().catch(() => ({}))) as { error?: string }

    if (!response.ok) {
      setError(payload.error || '삭제에 실패했습니다.')
      return
    }

    setMessage('제품이 삭제되었습니다.')
    await load()
    resetForm()
  }

  const uploadFiles = async (files: FileList | null) => {
    if (!selectedProduct || !files || files.length === 0) return

    setError('')
    setMessage('')
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('productId', String(selectedProduct.id))
      formData.append('primaryIndex', String(selectedProduct.images?.some((image) => image.isPrimary) ? -1 : 0))
      Array.from(files).forEach((file) => formData.append('files', file))

      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const payload = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(payload.error || '업로드에 실패했습니다.')

      setMessage('사진 업로드가 완료되었습니다.')
      await load()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const onUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await uploadFiles(event.target.files)
    event.target.value = ''
  }

  const onSetPrimary = async (imageId: number) => {
    if (!selectedProduct) return

    setError('')
    setMessage('')

    const response = await fetch(`/api/admin/products/${selectedProduct.id}/images/${imageId}`, { method: 'PATCH' })
    const payload = (await response.json()) as { error?: string }
    if (!response.ok) {
      setError(payload.error || '대표사진 설정에 실패했습니다.')
      return
    }

    setMessage('대표사진이 변경되었습니다.')
    await load()
  }

  const onDeleteImage = async (imageId: number) => {
    if (!selectedProduct) return
    if (!window.confirm('이 사진을 삭제하시겠습니까?')) return

    setError('')
    setMessage('')

    const response = await fetch(`/api/admin/products/${selectedProduct.id}/images/${imageId}`, { method: 'DELETE' })
    const payload = (await response.json()) as { error?: string }
    if (!response.ok) {
      setError(payload.error || '사진 삭제에 실패했습니다.')
      return
    }

    setMessage('사진이 삭제되었습니다.')
    await load()
  }

  return (
    <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="min-w-0 rounded-[24px] border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden">
        <div className="border-b border-stone-200 p-4">
          <div className="flex items-center gap-2">
            <label className="relative min-w-0 flex-1">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="제품 검색"
                className="min-h-[46px] w-full rounded-xl border border-stone-300 pl-10 pr-3 text-[15px] outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-200"
              />
            </label>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[46px] rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white transition active:translate-y-px"
            >
              새 제품
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
              className="min-h-[44px] rounded-xl border border-stone-300 px-3 text-[14px]"
            >
              <option value="all">전체 카테고리</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
            <select
              value={visibilityFilter}
              onChange={(event) => setVisibilityFilter(event.target.value as typeof visibilityFilter)}
              className="min-h-[44px] rounded-xl border border-stone-300 px-3 text-[14px]"
            >
              <option value="all">전체 상태</option>
              <option value="published">공개</option>
              <option value="draft">비공개</option>
            </select>
          </div>
          <p className="mt-3 text-[13px] font-semibold text-stone-500">총 {filteredProducts.length}개</p>
        </div>

        <div className="divide-y divide-stone-200 lg:max-h-[calc(100dvh-230px)] lg:overflow-y-auto">
          {isLoading ? (
            <p className="p-5 text-[15px] text-stone-500">불러오는 중입니다.</p>
          ) : filteredProducts.length === 0 ? (
            <p className="p-5 text-[15px] text-stone-500">조건에 맞는 제품이 없습니다.</p>
          ) : (
            filteredProducts.map((product) => {
              const active = product.id === selectedId

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className={`grid w-full grid-cols-[58px_minmax(0,1fr)] gap-3 px-4 py-3 text-left transition ${
                    active ? 'bg-stone-900 text-white' : 'bg-white text-stone-950 hover:bg-stone-50'
                  }`}
                >
                  <div className="h-[72px] overflow-hidden rounded-xl bg-stone-100">
                    <img src={normalizeImageUrl(product.imageUrl)} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">{product.name}</p>
                    <p className={`mt-1 truncate text-[13px] ${active ? 'text-white/60' : 'text-stone-500'}`}>
                      {product.categoryName || '카테고리 없음'} · {product.spec || '스펙 미입력'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                      {product.isFeatured ? (
                        <span className={`rounded-full px-2 py-1 ${active ? 'bg-amber-200/20 text-amber-100' : 'bg-amber-100 text-amber-800'}`}>홈 추천</span>
                      ) : null}
                      <span className={`rounded-full px-2 py-1 ${active ? 'bg-white/15 text-white/80' : product.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                        {product.isPublished ? '공개' : '비공개'}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </aside>

      <section className="min-w-0 rounded-[24px] border border-stone-200 bg-white lg:min-h-0 lg:overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stone-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              {selectedProduct ? '제품 수정' : '새 제품 등록'}
            </h2>
            <p className="mt-1 text-[14px] text-stone-500">홈 추천 노출과 공개 여부를 여기서 바로 조정합니다.</p>
          </div>
          {selectedProduct ? (
            <button
              type="button"
              onClick={() => void onDelete()}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition active:translate-y-px hover:bg-red-50"
            >
              <Trash2 size={16} />
              삭제
            </button>
          ) : null}
        </div>

        <div className="lg:max-h-[calc(100dvh-185px)] lg:overflow-y-auto">
          <form className="grid gap-4 p-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <Field label="카테고리">
              <select
                value={form.categoryId}
                onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                className="min-h-[48px] w-full rounded-xl border border-stone-300 px-3 text-[15px]"
              >
                <option value="">선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </Field>
            <Field label="제품명">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="min-h-[48px] w-full rounded-xl border border-stone-300 px-3 text-[15px] outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-200"
              />
            </Field>
            <Field label="스펙">
              <input
                value={form.spec}
                onChange={(event) => setForm((prev) => ({ ...prev, spec: event.target.value }))}
                placeholder="예: 18K / Diamond"
                className="min-h-[48px] w-full rounded-xl border border-stone-300 px-3 text-[15px] outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-200"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={form.isFeatured} onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}>
                {form.isFeatured ? '홈 추천 ON' : '홈 추천 OFF'}
              </ToggleButton>
              <ToggleButton active={form.isPublished} onClick={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}>
                {form.isPublished ? '공개 ON' : '비공개'}
              </ToggleButton>
            </div>
            <Field label="설명" full>
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-stone-300 px-3 py-3 text-[15px] leading-7 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-200"
              />
            </Field>

            {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700 sm:col-span-2">{error}</p> : null}
            {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[14px] text-emerald-700 sm:col-span-2">{message}</p> : null}

            <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-sm font-semibold text-white transition active:translate-y-px disabled:opacity-60"
              >
                <Save size={16} />
                {isSaving ? '저장 중' : selectedProduct ? '제품 저장' : '1단계 저장'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition active:translate-y-px hover:bg-stone-50"
              >
                입력 초기화
              </button>
            </div>
          </form>

          <section className="border-t border-stone-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-stone-950">사진</h3>
                <p className="mt-1 text-[14px] text-stone-500">제품 저장 후 촬영 또는 앨범 업로드가 가능합니다.</p>
              </div>
              {selectedProduct ? <p className="text-sm font-semibold text-stone-500">{selectedProduct.images?.length ?? 0}장</p> : null}
            </div>

            {selectedProduct ? (
              <>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <UploadButton label="카메라로 촬영" Icon={Camera} capture onChange={onUploadChange} />
                  <UploadButton label="앨범에서 선택" Icon={ImagePlus} multiple onChange={onUploadChange} />
                </div>
                {isUploading ? <p className="mt-3 text-[14px] text-stone-500">사진 업로드 중입니다.</p> : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {selectedProduct.images?.map((image) => (
                    <article key={image.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                      <div className="aspect-[4/3] bg-stone-100">
                        <img src={normalizeImageUrl(image.url)} alt={image.altText || selectedProduct.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-3">
                        <button
                          type="button"
                          onClick={() => void onSetPrimary(image.id)}
                          className={`min-h-[42px] rounded-xl text-[13px] font-semibold transition active:translate-y-px ${
                            image.isPrimary ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700'
                          }`}
                        >
                          대표사진
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDeleteImage(image.id)}
                          className="min-h-[42px] rounded-xl border border-red-200 bg-white text-[13px] font-semibold text-red-600 transition active:translate-y-px hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </article>
                  ))}
                  {(selectedProduct.images?.length ?? 0) === 0 ? (
                    <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-[15px] text-stone-500 sm:col-span-2">
                      아직 사진이 없습니다. 위 버튼으로 추가하세요.
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-stone-300 p-5 text-[15px] text-stone-500">
                먼저 제품 기본정보를 저장해 주세요.
              </p>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}

function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label className="mb-2 block text-[14px] font-semibold text-stone-800">{label}</label>
      {children}
    </div>
  )
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[48px] rounded-xl text-[14px] font-semibold transition active:translate-y-px ${
        active ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-600'
      }`}
    >
      {children}
    </button>
  )
}

function UploadButton({
  label,
  Icon,
  capture = false,
  multiple = false,
  onChange,
}: {
  label: string
  Icon: typeof Camera
  capture?: boolean
  multiple?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="inline-flex min-h-[58px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 transition active:translate-y-px hover:bg-stone-50">
      <Icon size={17} />
      {label}
      <input
        type="file"
        accept="image/*"
        capture={capture ? 'environment' : undefined}
        multiple={multiple}
        className="hidden"
        onChange={(event) => void onChange(event)}
      />
    </label>
  )
}
