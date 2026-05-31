'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Gem,
  Gift,
  Heart,
  Instagram,
  Leaf,
  Menu,
  MessageCircle,
  Plus,
  X,
} from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { cn } from '@/lib/utils'
import { KAKAO_OPENCHAT_URL } from '@/lib/site-links'
import type { SiteSettings } from '@/lib/site-settings'

const GENERIC_PRODUCT_PLACEHOLDER = '/img/hero/hero.png'
const HOME_HERO_IMAGE = '/img/products-generated/home-hero-desktop.png'
const HOME_HERO_MOBILE_IMAGE = '/img/products-generated/home-hero-mobile.png'
const HOME_BRAND_IMAGE = '/img/products-generated/home-brand-desktop.png'
const HOME_BRAND_MOBILE_IMAGE = '/img/products-generated/home-brand-mobile.png'
const HOME_SIGNATURE_IMAGE = '/img/products-generated/home-signature-desktop.png'
const HOME_SIGNATURE_MOBILE_IMAGE = '/img/products-generated/home-signature-mobile.png'

const HOME_IMAGES = {
  collectionBracelet: '/img/products-generated/home-collection-bracelet-card.png',
  collectionEarrings: '/img/products-generated/home-collection-earrings-card.png',
  collectionNecklace: '/img/products-generated/home-collection-necklace-card.png',
  collectionRing: '/img/products-generated/home-collection-ring-card.png',
  bestBracelet: '/img/products-generated/home-best-bracelet-portrait.png',
  bestEarrings: '/img/products-generated/home-best-earrings-portrait.png',
  bestNecklace: '/img/products-generated/home-best-necklace-portrait.png',
  bestRing: '/img/products-generated/home-best-ring-portrait.png',
  giftConsultation: '/img/products-generated/home-gift-consultation-portrait.png',
} as const

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: '공지사항', href: '/notices' },
  { label: 'FAQ', href: '/faq' },
] as const

export type HomeProduct = {
  id: number
  categoryName?: string
  categorySlug?: string
  imageUrl: string | null
  name: string
  slug: string
  spec: string | null
}

type ProductCard = {
  key: string
  name: string
  detail: string
  price: string
  image: string
  href: string
}

const categoryImageMap: Record<string, string> = {
  bracelets: HOME_IMAGES.bestBracelet,
  earrings: HOME_IMAGES.bestEarrings,
  necklaces: HOME_IMAGES.bestNecklace,
  rings: HOME_IMAGES.bestRing,
}

const fallbackProducts: ProductCard[] = [
  { key: 'fallback-1', name: '에끌라 다이아 링', detail: '14K 골드, 다이아몬드 세팅', price: '가격 문의', image: HOME_IMAGES.bestRing, href: '/products/rings' },
  { key: 'fallback-2', name: '루미에르 라인 목걸이', detail: '매일 착용하기 좋은 슬림 라인', price: '가격 문의', image: HOME_IMAGES.bestNecklace, href: '/products/necklaces' },
  { key: 'fallback-3', name: '클래식 골드 체인 팔찌', detail: '단독 또는 레이어드 착용 추천', price: '가격 문의', image: HOME_IMAGES.bestBracelet, href: '/products/bracelets' },
  { key: 'fallback-4', name: '헤일로 링 귀걸이', detail: '얼굴선을 은은하게 밝혀주는 디자인', price: '가격 문의', image: HOME_IMAGES.bestEarrings, href: '/products/earrings' },
  { key: 'fallback-5', name: '스텔라 다이아 목걸이', detail: '작은 포인트가 오래 남는 목걸이', price: '가격 문의', image: HOME_IMAGES.bestNecklace, href: '/products/necklaces' },
  { key: 'fallback-6', name: '볼륨 플라워 링', detail: '손끝에 부드러운 입체감을 더하는 링', price: '가격 문의', image: HOME_IMAGES.bestRing, href: '/products/rings' },
] as const

const footerGroups = [
  {
    title: 'SHOP',
    links: [
      { label: '컬렉션', href: '/products' },
      { label: '추천 제품', href: '/products' },
      { label: '공지사항', href: '/notices' },
      { label: '선물 상담', href: '/contact' },
    ],
  },
  {
    title: 'CUSTOMER',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: '공지사항', href: '/notices' },
      { label: '거래 안내', href: '/trade' },
      { label: '방문 상담', href: '/location' },
      { label: '문의하기', href: '/contact' },
    ],
  },
  {
    title: 'ABOUT US',
    links: [
      { label: '브랜드 스토리', href: '/about' },
      { label: '도매 상담', href: '/trade' },
      { label: '오시는 길', href: '/location' },
    ],
  },
] as const

const getProductHref = (product: Pick<HomeProduct, 'categorySlug' | 'slug'>) => {
  if (product.categorySlug && product.slug) {
    return `/products/${product.categorySlug}/${product.slug}`
  }
  return '/products'
}

const resolveProductImage = (product: HomeProduct, index: number) => {
  if (
    product.imageUrl &&
    product.imageUrl !== GENERIC_PRODUCT_PLACEHOLDER &&
    !product.imageUrl.startsWith('products/')
  ) {
    return product.imageUrl
  }

  if (product.categorySlug && categoryImageMap[product.categorySlug]) {
    return categoryImageMap[product.categorySlug]
  }

  return fallbackProducts[index % fallbackProducts.length].image
}

export default function HomeView({
  settings,
  featuredProducts,
}: {
  settings: SiteSettings
  featuredProducts: HomeProduct[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('home-reference-page')
    return () => {
      document.body.classList.remove('home-reference-page')
    }
  }, [])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [menuOpen])

  const bestSellerCards = useMemo(() => {
    const dynamicCards = featuredProducts.slice(0, 6).map((product, index) => ({
      key: `dynamic-${product.id}`,
      name: product.name,
      detail: product.spec || `${product.categoryName || 'Ju 컬렉션'} 추천 제품`,
      price: '가격 문의',
      image: resolveProductImage(product, index),
      href: getProductHref(product),
    }))

    const merged = [...dynamicCards]
    for (const item of fallbackProducts) {
      if (merged.length >= 6) break
      merged.push(item)
    }
    return merged.slice(0, 6)
  }, [featuredProducts])

  const contactLines = [settings.phonePrimary, settings.phoneSecondary, settings.email].filter(Boolean)
  const benefits = [
    { title: settings.homeBenefit1Title, description: settings.homeBenefit1Description, Icon: Gem },
    { title: settings.homeBenefit2Title, description: settings.homeBenefit2Description, Icon: Gift },
    { title: settings.homeBenefit3Title, description: settings.homeBenefit3Description, Icon: Leaf },
    { title: settings.homeBenefit4Title, description: settings.homeBenefit4Description, Icon: MessageCircle },
  ]
  const collections = [
    { title: settings.homeCollectionNecklacesTitle, subtitle: settings.homeCollectionNecklacesSubtitle, image: HOME_IMAGES.collectionNecklace, href: '/products/necklaces' },
    { title: settings.homeCollectionEarringsTitle, subtitle: settings.homeCollectionEarringsSubtitle, image: HOME_IMAGES.collectionEarrings, href: '/products/earrings' },
    { title: settings.homeCollectionRingsTitle, subtitle: settings.homeCollectionRingsSubtitle, image: HOME_IMAGES.collectionRing, href: '/products/rings' },
    { title: settings.homeCollectionBraceletsTitle, subtitle: settings.homeCollectionBraceletsSubtitle, image: HOME_IMAGES.collectionBracelet, href: '/products/bracelets' },
  ]
  const consultationItems = [
    { title: settings.homeConsultFeature1Title, description: settings.homeConsultFeature1Description, Icon: Gift },
    { title: settings.homeConsultFeature2Title, description: settings.homeConsultFeature2Description, Icon: MessageCircle },
    { title: settings.homeConsultFeature3Title, description: settings.homeConsultFeature3Description, Icon: Gem },
  ]

  return (
    <div className="bg-[#f3ece3] text-[#2d211a]">
      <div
        className={cn(
          'fixed inset-0 z-[70] transition-all duration-300',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="absolute inset-0 bg-[#120d09]/76 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={cn(
            'absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[#2e2119] px-7 py-7 text-white transition-transform duration-300 sm:px-9',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="brand-wordmark text-[2rem] leading-none tracking-[0.08em]">Ju</span>
            <button type="button" aria-label="닫기" onClick={() => setMenuOpen(false)} className="p-2 text-white/80">
              <X size={22} />
            </button>
          </div>

          <div className="mt-10">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#d8b78c]">Explore</p>
            <nav className="mt-5 border-t border-white/10">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/10 py-5"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-display text-[1.75rem] leading-none">{item.label}</span>
                  <span className="text-[11px] tracking-[0.24em] text-white/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] leading-7 text-white/70">{settings.homeMenuNote}</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 border border-[#c59a69] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e3cb]"
              onClick={() => setMenuOpen(false)}
            >
              {settings.homeMenuCta}
              <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </div>

      <section className="relative min-h-[100dvh] overflow-hidden bg-[#403026] sm:min-h-[780px] lg:min-h-[860px]">
        <ShowcaseImage
          src={HOME_HERO_IMAGE}
          mobileSrc={HOME_HERO_MOBILE_IMAGE}
          alt="메인 히어로 주얼리"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#403026]"
          imageClassName="object-cover object-[70%_44%] md:object-[76%_44%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(42,28,20,0.38)_0%,rgba(42,28,20,0.16)_38%,rgba(33,22,16,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,240,227,0.08),transparent_28%)]" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col px-5 pb-12 pt-5 sm:min-h-[780px] sm:px-10 sm:pb-20 sm:pt-8 lg:min-h-[860px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">
              Ju
            </Link>
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={() => setMenuOpen(true)}
              className="text-white transition-opacity hover:opacity-80"
            >
              <Menu size={24} strokeWidth={1.7} />
            </button>
          </div>

          <div className="my-auto flex flex-col items-center justify-center pb-8 text-center sm:pb-12">
            <div className="mx-auto flex w-[150px] items-center justify-center gap-4 text-[#dcc09c]">
              <span className="h-px flex-1 bg-current/45" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/80" />
              <span className="h-px flex-1 bg-current/45" />
            </div>
            <h1 className="sr-only">종로 귀금속 도매 JU JEWELRY</h1>
            <p aria-hidden="true" className="hero-brand-mark mt-5 text-[4rem] italic leading-none tracking-[0.04em] text-white sm:text-[7.5rem]">
              Ju
            </p>
            <p className="mt-5 max-w-[420px] text-[13px] leading-7 text-white/82 sm:text-[15px]">
              <span className="block sm:inline">{settings.homeHeroLine1}</span>
              <span className="block sm:inline sm:ml-1">{settings.homeHeroLine2}</span>
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex min-h-[52px] w-full max-w-[260px] items-center justify-center gap-4 border border-[#efe5da] bg-[#f7f3ed] px-6 text-[12px] tracking-[0.18em] text-[#5a4337] transition-colors hover:bg-white sm:w-auto sm:min-w-[240px] sm:px-8"
            >
              {settings.homeHeroCta}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e4d6c6] bg-[#fbf7f2]">
        <div className="mx-auto grid max-w-[1440px] gap-y-7 px-5 py-7 sm:px-10 sm:py-8 lg:grid-cols-4 lg:gap-0">
          {benefits.map((item, index) => {
            const Icon = item.Icon
            return (
              <article
                key={item.title}
                className={cn(
                  'grid grid-cols-[40px_minmax(0,1fr)] items-start gap-4 lg:px-8',
                  index < benefits.length - 1 && 'lg:border-r lg:border-[#e2d4c5]'
                )}
              >
                <div className="pt-1 text-[#b68d5d]">
                  <Icon size={25} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-[13px] uppercase tracking-[0.16em] text-[#674d3f]">{item.title}</h2>
                  <p className="mt-2 max-w-[240px] text-[12px] leading-6 text-[#7d6c5f] sm:text-[13px]">{item.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#3f2f25]">
        <div className="absolute inset-0 hidden lg:block">
          <ShowcaseImage
            src={HOME_BRAND_IMAGE}
            mobileSrc={HOME_BRAND_MOBILE_IMAGE}
            alt="골드 목걸이"
            className="h-full w-full bg-[#3f2f25]"
            imageClassName="object-cover object-[82%_74%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(63,47,37,0.98)_0%,rgba(63,47,37,0.95)_18%,rgba(63,47,37,0.84)_32%,rgba(63,47,37,0.58)_46%,rgba(63,47,37,0.26)_62%,rgba(63,47,37,0.08)_78%,rgba(63,47,37,0.02)_100%)]" />
          <div className="absolute inset-y-0 left-[30%] w-[28%] bg-[radial-gradient(circle_at_center,rgba(136,104,79,0.3)_0%,rgba(136,104,79,0.14)_42%,rgba(63,47,37,0)_76%)] blur-[56px]" />
        </div>
        <div className="relative mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-10 sm:py-[4.5rem] lg:grid-cols-[440px_minmax(0,1fr)] lg:py-20">
          <div className="max-w-[430px]">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#d6b28b]">{settings.homeBrandKicker}</p>
            <h2 className="font-display text-balance mt-5 text-[2.2rem] leading-[1.35] text-[#f4e8d9] sm:text-[2.85rem]">
              <span className="block">{settings.homeBrandTitle1}</span>
              <span className="block">{settings.homeBrandTitle2}</span>
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-white/70">{settings.homeBrandDescription}</p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-4 border border-[#9e7a5b] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-[#f0dec9] transition-colors hover:bg-white/5"
            >
              {settings.homeBrandCta}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden lg:hidden">
            <ShowcaseImage
              src={HOME_BRAND_MOBILE_IMAGE}
              alt="골드 목걸이"
              className="aspect-[4/3]"
              imageClassName="object-cover object-[72%_68%]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7f2] px-5 py-14 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#b68d5d]">{settings.homeCollectionKicker}</p>
            <h2 className="font-display mt-3 text-[2.5rem] leading-none text-[#3d2d23] sm:text-[3.4rem]">{settings.homeCollectionTitle}</h2>
            <div className="mx-auto mt-4 h-px w-10 bg-[#caa57b]" />
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-4">
            {collections.map((item) => (
              <Link key={item.title} href={item.href} className="group block bg-white">
                <ShowcaseImage
                  src={item.image}
                  alt={item.title}
                  className="aspect-[1.1/0.96]"
                  imageClassName="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="flex items-end justify-between gap-5 border border-t-0 border-[#e3d7ca] px-5 py-5">
                  <div>
                    <h3 className="font-display text-[1.5rem] leading-none tracking-[0.06em] text-[#3d2d23]">{item.title}</h3>
                    <p className="mt-2 text-[13px] text-[#7b6b5f]">{item.subtitle}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b79776] text-[#8c6a4a]">
                    <Plus size={15} strokeWidth={1.7} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1ea] px-5 py-14 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#b68d5d]">{settings.homeRecommendedKicker}</p>
            <h2 className="font-display mt-3 text-[2.45rem] leading-none text-[#3d2d23] sm:text-[3.2rem]">{settings.homeRecommendedTitle}</h2>
            <div className="mx-auto mt-4 h-px w-10 bg-[#caa57b]" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
            {bestSellerCards.map((item) => (
              <Link key={item.key} href={item.href} className="group block bg-white">
                <div className="relative overflow-hidden">
                  <span className="absolute right-3 top-3 z-10 text-white/85">
                    <Heart size={18} strokeWidth={1.5} />
                  </span>
                  <ShowcaseImage
                    src={item.image}
                    alt={item.name}
                    className="aspect-[0.95/1]"
                    imageClassName="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="border border-t-0 border-[#e3d7ca] px-3 py-3 text-center sm:px-4 sm:py-4">
                  <h3 className="min-h-[40px] text-[13px] leading-6 text-[#3a2b22] sm:text-[14px]">{item.name}</h3>
                  <p className="mt-2 text-[12px] leading-5 text-[#8b7a6b]">{item.detail}</p>
                  <p className="mt-1 text-[14px] text-[#6a4d3d]">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-4 border border-[#bca58d] px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-[#6b4e3e] transition-colors hover:bg-white"
            >
              더 많은 제품 보기
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#433125]">
        <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:block">
          <ShowcaseImage
            src={HOME_SIGNATURE_IMAGE}
            mobileSrc={HOME_SIGNATURE_MOBILE_IMAGE}
            alt="시그니처 목걸이"
            className="h-full w-full bg-[#433125]"
            imageClassName="object-cover object-[82%_40%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(67,49,37,1)_0%,rgba(67,49,37,0.55)_32%,rgba(67,49,37,0.08)_100%)]" />
        </div>
        <div className="relative mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-[520px_minmax(0,1fr)] lg:py-[4.5rem]">
          <div className="max-w-[430px]">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#d6b28b]">{settings.homeSignatureKicker}</p>
            <h2 className="font-display text-balance mt-4 text-[2.2rem] leading-[1.28] text-[#f4e8d9] sm:text-[2.85rem]">
              <span className="block">{settings.homeSignatureTitle1}</span>
              <span className="block">{settings.homeSignatureTitle2}</span>
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-white/70">{settings.homeSignatureDescription}</p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-4 border border-[#9e7a5b] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-[#f0dec9] transition-colors hover:bg-white/5"
            >
              {settings.homeSignatureCta}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden lg:hidden">
            <ShowcaseImage
              src={HOME_SIGNATURE_MOBILE_IMAGE}
              alt="시그니처 목걸이"
              className="aspect-[4/3]"
              imageClassName="object-cover object-[72%_44%]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[#eadfd2] bg-[#fbf7f2]">
        <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="overflow-hidden">
            <ShowcaseImage
              src={HOME_IMAGES.giftConsultation}
              alt="주얼리 착용 컷"
              className="h-full min-h-[280px] lg:min-h-[100%]"
              imageClassName="object-cover object-center"
            />
          </div>

          <div className="px-5 py-10 sm:px-10 sm:py-12 lg:px-12">
            <p className="font-display text-[11px] uppercase tracking-[0.28em] text-[#b68d5d]">{settings.homeConsultKicker}</p>
            <h2 className="font-display mt-4 text-[2.1rem] leading-[1.3] text-[#3a2b22] sm:text-[2.65rem]">
              <span className="block">{settings.homeConsultTitle1}</span>
              <span className="block">{settings.homeConsultTitle2}</span>
            </h2>
            <p className="mt-4 max-w-[560px] text-[15px] leading-8 text-[#76675b]">{settings.homeConsultDescription}</p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-4 bg-[#5c4437] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#443126]"
            >
              {settings.homeConsultCta}
              <ArrowRight size={15} />
            </Link>

            <div className="mt-8 grid gap-5 border-t border-[#e4d6c6] pt-6 sm:mt-10 sm:grid-cols-3 sm:gap-8 sm:pt-8">
              {consultationItems.map((item, index) => {
                const Icon = item.Icon
                return (
                  <article
                    key={item.title}
                    className={cn(
                      'border-t border-[#eadfd2] pt-5 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0',
                      index === 0 && 'first:border-t-0 first:pt-0 sm:first:border-l-0 sm:first:pl-0'
                    )}
                  >
                    <Icon size={22} strokeWidth={1.5} className="text-[#b68d5d]" />
                    <h3 className="mt-4 text-[15px] text-[#3e2f25]">{item.title}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-[#7b6c60]">{item.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#5d4738] bg-[#34261f] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
            <div>
              <h2 className="font-display text-[3rem] italic leading-none text-white">Ju</h2>
              <p className="mt-4 max-w-[240px] text-[14px] leading-7 text-white/72">{settings.homeFooterNote}</p>
              <div className="mt-6 flex gap-3">
                <a
                  href={settings.instagramUrl || '#'}
                  target={settings.instagramUrl ? '_blank' : undefined}
                  rel={settings.instagramUrl ? 'noreferrer' : undefined}
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/35 hover:text-white"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={KAKAO_OPENCHAT_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="카카오톡 오픈채팅"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/35 hover:text-white"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title} className="hidden md:block">
                <h3 className="font-display text-[12px] uppercase tracking-[0.22em] text-[#d7b996]">{group.title}</h3>
                <ul className="mt-5 space-y-3 text-[14px] text-white/70">
                  {group.links.map((item) => (
                    <li key={`${group.title}-${item.label}`}>
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="font-display text-[12px] uppercase tracking-[0.22em] text-[#d7b996]">CONTACT</h3>
              <ul className="mt-5 space-y-3 text-[14px] leading-7 text-white/70">
                {contactLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                <li>{settings.businessHours}</li>
                <li>{settings.address}</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 {settings.shopName}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="transition-colors hover:text-white/75">이용약관</Link>
              <Link href="/privacy" className="transition-colors hover:text-white/75">개인정보처리방침</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
