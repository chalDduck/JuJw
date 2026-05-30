'use client'

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent, ReactNode, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Camera, ImagePlus, PackagePlus, Save, Search, Trash2 } from 'lucide-react'

type Category = { id: number; name: string; slug: string }

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

const inputClass =
  'min-h-[54px] w-full rounded-2xl border border-stone-300 bg-white px-4 text-[16px] outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70'

function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || url.startsWith('products/')) return '/img/hero/hero.png'
  return url
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p className="p-6 text-[16px] text-stone-500">불러오는 중입니다…</p>}>
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
          if (found) hydrateForm(found)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedId(null)
    setForm({ ...initialForm, categoryId: categories[0] ? String(categories[0].id) : '' })
    setError('')
    setMessage('')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!form.categoryId && categories[0]) {
      setForm((prev) => ({ ...prev, categoryId: String(categories[0].id) }))
    }
  }, [categories, form.categoryId])

  useEffect(() => {
    if (searchParams.get('new') === '1') resetForm()
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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!form.categoryId || !form.name.trim()) {
      setError('카테고리와 제품명은 꼭 입력해 주세요.')
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
      if (!response.ok || !payload.product) throw new Error(payload.error || '저장에 실패했습니다.')
      setMessage(selectedId ? '제품 정보를 저장했습니다.' : '제품을 저장했습니다. 아래에서 사진을 추가하세요.')
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
    if (!window.confirm(`"${selectedProduct.name}" 제품을 삭제할까요?`)) return
    setError('')
    setMessage('')
    const response = await fetch(`/api/admin/products/${selectedProduct.id}`, { method: 'DELETE' })
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    if (!response.ok) {
      setError(payload.error || '삭제에 실패했습니다.')
      return
    }
    setMessage('제품을 삭제했습니다.')
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
      setMessage('사진을 올렸습니다.')
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
    setMessage('대표사진을 바꿨습니다.')
    await load()
  }

  const onDeleteImage = async (imageId: number) => {
    if (!selectedProduct) return
    if (!window.confirm('이 사진을 삭제할까요?')) return
    setError('')
    setMessage('')
    const response = await fetch(`/api/admin/products/${selectedProduct.id}/images/${imageId}`, { method: 'DELETE' })
    const payload = (await response.json()) as { error?: string }
    if (!response.ok) {
      setError(payload.error || '사진 삭제에 실패했습니다.')
      return
    }
    setMessage('사진을 삭제했습니다.')
    await load()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 1) 제품 정보 입력 */}
      <form className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[20px] font-bold tracking-tight text-stone-950">
            {selectedProduct ? '제품 수정' : '새 제품 등록'}
          </h2>
          {selectedProduct ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-300 px-3 text-[14px] font-semibold text-stone-700 transition active:translate-y-px hover:bg-stone-50"
            >
              <PackagePlus size={16} />
              새 제품
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-[14px] text-stone-500">위에서부터 차례대로 입력하고 맨 아래 저장을 누르세요.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">1. 카테고리</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              className={inputClass}
            >
              <option value="">선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">2. 제품명</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="예: 18K 다이아 반지"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">3. 스펙 (선택)</label>
            <input
              value={form.spec}
              onChange={(e) => setForm((prev) => ({ ...prev, spec: e.target.value }))}
              placeholder="예: 18K / Diamond 0.3ct"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">4. 설명 (선택)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="제품 설명을 적어 주세요."
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-[16px] leading-8 outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-stone-800">5. 노출 설정</label>
            <div className="grid grid-cols-2 gap-2">
              <ToggleButton active={form.isFeatured} onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}>
                {form.isFeatured ? '홈 추천 ✓' : '홈 추천 안 함'}
              </ToggleButton>
              <ToggleButton active={form.isPublished} onClick={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}>
                {form.isPublished ? '공개 중 ✓' : '숨김'}
              </ToggleButton>
            </div>
          </div>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-[15px] text-red-700">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-[15px] text-emerald-700">{message}</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 text-[17px] font-bold text-white transition active:translate-y-px disabled:opacity-60"
            >
              <Save size={19} />
              {isSaving ? '저장 중…' : selectedProduct ? '제품 저장' : '제품 저장하고 사진 추가'}
            </button>
            {selectedProduct ? (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-2xl border border-red-200 px-5 text-[16px] font-semibold text-red-600 transition active:translate-y-px hover:bg-red-50"
              >
                <Trash2 size={18} />
                삭제
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {/* 2) 사진 */}
      <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-[18px] font-bold tracking-tight text-stone-950">제품 사진</h2>
        {selectedProduct ? (
          <>
            <p className="mt-1 text-[14px] text-stone-500">
              현재 {selectedProduct.images?.length ?? 0}장. 카메라로 찍거나 앨범에서 고를 수 있습니다.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <UploadButton label="카메라로 촬영" Icon={Camera} capture onChange={onUploadChange} />
              <UploadButton label="앨범에서 선택" Icon={ImagePlus} multiple onChange={onUploadChange} />
            </div>
            {isUploading ? <p className="mt-3 text-[14px] text-stone-500">사진 올리는 중입니다…</p> : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selectedProduct.images?.map((image) => (
                <article key={image.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                  <div className="aspect-[4/3] bg-stone-100">
                    <img src={normalizeImageUrl(image.url)} alt={image.altText || selectedProduct.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => void onSetPrimary(image.id)}
                      className={`min-h-[46px] rounded-xl text-[14px] font-semibold transition active:translate-y-px ${
                        image.isPrimary ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      {image.isPrimary ? '대표사진 ✓' : '대표로'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDeleteImage(image.id)}
                      className="min-h-[46px] rounded-xl border border-red-200 bg-white text-[14px] font-semibold text-red-600 transition active:translate-y-px hover:bg-red-50"
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
          <p className="mt-3 rounded-2xl border border-dashed border-stone-300 p-5 text-[15px] text-stone-500">
            먼저 위에서 제품을 저장하면 사진을 올릴 수 있습니다.
          </p>
        )}
      </section>

      {/* 3) 등록된 제품 목록 */}
      <section className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-[18px] font-bold tracking-tight text-stone-950">등록된 제품 ({filteredProducts.length})</h2>
        <div className="mt-4 space-y-2">
          <label className="relative block">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제품 검색"
              className="min-h-[50px] w-full rounded-2xl border border-stone-300 pl-11 pr-3 text-[16px] outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-200/70"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="min-h-[48px] rounded-2xl border border-stone-300 px-3 text-[15px]"
            >
              <option value="all">전체 카테고리</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as typeof visibilityFilter)}
              className="min-h-[48px] rounded-2xl border border-stone-300 px-3 text-[15px]"
            >
              <option value="all">전체 상태</option>
              <option value="published">공개</option>
              <option value="draft">숨김</option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {isLoading ? (
            <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-center text-[15px] text-stone-500">불러오는 중입니다…</p>
          ) : filteredProducts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-center text-[15px] text-stone-500">조건에 맞는 제품이 없습니다.</p>
          ) : (
            filteredProducts.map((product) => {
              const active = product.id === selectedId
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    hydrateForm(product)
                    setError('')
                    setMessage('')
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`grid w-full grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-2xl border p-2 text-left transition active:translate-y-px ${
                    active ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                    <img src={normalizeImageUrl(product.imageUrl)} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 self-center">
                    <p className="truncate text-[16px] font-semibold">{product.name}</p>
                    <p className={`mt-0.5 truncate text-[13px] ${active ? 'text-white/60' : 'text-stone-500'}`}>
                      {product.categoryName || '카테고리 없음'} · {product.isPublished ? '공개' : '숨김'}
                      {product.isFeatured ? ' · 홈 추천' : ''}
                    </p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[54px] rounded-2xl text-[15px] font-semibold transition active:translate-y-px ${
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
    <label className="inline-flex min-h-[60px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 text-[16px] font-semibold text-stone-800 transition active:translate-y-px hover:bg-stone-50">
      <Icon size={18} />
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
