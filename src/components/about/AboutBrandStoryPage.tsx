'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  MessageCircle,
  Gem,
  Hammer,
  HandHeart,
  Instagram,
  Lightbulb,
  Menu,
  PencilLine,
  Sparkles,
  X,
} from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { cn } from '@/lib/utils'
import { KAKAO_OPENCHAT_URL } from '@/lib/site-links'
import type { SiteSettings } from '@/lib/site-settings'

type AboutBrandStoryPageProps = {
  settings: SiteSettings
}

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: 'FAQ', href: '/faq' },
] as const

const values = [
  {
    number: '01',
    title: '시간을 초월한 아름다움',
    body: ['흐르지 않는 가치를 담아', '오래도록 사랑받는 디자인'],
    Icon: Gem,
  },
  {
    number: '02',
    title: '섬세한 장인정신',
    body: ['티끌 하나까지 놓치지 않는', '정교한 세공과 완성도'],
    Icon: HandHeart,
  },
  {
    number: '03',
    title: '의미 있는 순간',
    body: ['당신의 특별한 순간을 더욱 빛나게', '기억의 가치를 만듭니다'],
    Icon: Sparkles,
  },
] as const

const detailCards = [
  {
    title: '디테일',
    description: '정밀한 확인과 마감으로 완성도를 높입니다.',
    image: '/img/about-generated/about-detail-gem.png',
    position: 'object-center',
  },
  {
    title: '정교함',
    description: '숙련된 손길로 완성되는 골드 체인의 결을 담았습니다.',
    image: '/img/about-generated/about-detail-craft.png',
    position: 'object-center',
  },
  {
    title: '엄선된 소재',
    description: '균형 있는 컬러와 광채를 고려해 소재를 고릅니다.',
    image: '/img/about-generated/about-detail-stones.png',
    position: 'object-center',
  },
] as const

const processSteps = [
  {
    number: '01',
    title: '영감',
    description: '일상 속 장면에서 오래 남을 무드를 먼저 찾습니다.',
    Icon: Lightbulb,
  },
  {
    number: '02',
    title: '디자인',
    description: '비율과 착용감을 함께 고려해 형태를 정리합니다.',
    Icon: PencilLine,
  },
  {
    number: '03',
    title: '세공',
    description: '정교한 마감과 광택으로 완성도를 끌어올립니다.',
    Icon: Hammer,
  },
  {
    number: '04',
    title: '완성',
    description: '당신의 순간에 닿을 수 있도록 마지막 균형을 확인합니다.',
    Icon: Sparkles,
  },
] as const

const footerColumns = [
  {
    title: 'SHOP',
    items: ['컬렉션', '목걸이', '귀걸이', '반지', '팔찌'],
  },
  {
    title: 'CUSTOMER',
    items: ['자주 묻는 질문', '배송 안내', '교환/반품 안내', '사이즈 가이드'],
  },
  {
    title: 'ABOUT US',
    items: ['브랜드 스토리', '상담 안내', '제품 문의', '오시는 길'],
  },
] as const

export default function AboutBrandStoryPage({ settings }: AboutBrandStoryPageProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('about-reference-page')

    return () => {
      document.body.classList.remove('about-reference-page')
      document.body.style.removeProperty('overflow')
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty('overflow')
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [menuOpen])

  const socialLinks = [
    { href: settings.instagramUrl || '/contact', label: 'Instagram', Icon: Instagram },
    { href: KAKAO_OPENCHAT_URL, label: '카카오톡', Icon: MessageCircle },
  ]

  return (
    <div data-about-shell className="bg-[#f4efe8] text-[#46352a]">
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
            <span className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">Ju</span>
            <button type="button" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)} className="p-2 text-white/80">
              <X size={22} strokeWidth={1.7} />
            </button>
          </div>

          <div className="mt-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d8b78c]">
              Explore
            </p>
            <nav className="mt-5 border-t border-white/10">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/10 py-5"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-[1.55rem] font-semibold leading-none">
                    {item.label}
                  </span>
                  <span className="text-[11px] tracking-[0.24em] text-white/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] leading-7 text-white/70">
              브랜드 스토리와 컬렉션 상담은 문의 페이지에서 바로 예약할 수 있습니다.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 border border-[#c59a69] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e3cb]"
              onClick={() => setMenuOpen(false)}
            >
              상담 예약
              <ArrowRight size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </aside>
      </div>

      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#5d483a] sm:min-h-[620px] md:min-h-[760px]">
        <ShowcaseImage
          src="/img/about-generated/about-hero-desktop.png"
          mobileSrc="/img/about-generated/about-hero-mobile.png"
          alt="브랜드 스토리 히어로 주얼리"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#5d483a]"
          imageClassName="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(63,43,31,0.72)_0%,rgba(63,43,31,0.42)_35%,rgba(63,43,31,0.18)_62%,rgba(63,43,31,0.1)_100%)]" />

        <div className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
            <Link href="/" className="brand-wordmark text-[2rem] leading-none tracking-[0.08em] text-white">
              Ju
            </Link>
            <div className="flex items-center gap-5 text-white">
              <button type="button" aria-label="메뉴 열기" className="transition-opacity hover:opacity-80" onClick={() => setMenuOpen(true)}>
                <Menu size={24} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1440px] items-center px-5 pb-16 pt-24 sm:min-h-[620px] sm:px-6 sm:pb-20 sm:pt-28 md:min-h-[760px] md:px-10 md:pt-32">
          <div className="max-w-[460px] text-white">
            <div className="mb-5 flex items-center gap-4 text-[#dfc7aa]">
              <span className="h-px w-12 bg-current/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/80" />
              <span className="h-px w-20 bg-current/35" />
            </div>
            <h1 className="text-[2.65rem] font-semibold leading-[1.14] sm:text-[4.1rem]">
              브랜드 스토리
            </h1>
            <p className="mt-6 text-[1rem] leading-8 text-[#f1e6da] sm:text-[1.12rem] sm:leading-9">
              시간이 흘러도 빛나는 아름다움,
              <br />
              당신의 순간을 더욱 빛나게
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[1.02fr_0.98fr] md:items-center md:gap-10">
          <div className="px-2 md:px-0">
            <h2 className="text-[2.2rem] font-semibold leading-[1.3] text-[#3e2d23] sm:text-[2.85rem]">
              빛을 가장 우아하게 담는 이름, Ju
            </h2>
            <div className="mt-5 h-px w-16 bg-[#d0b69b]" />
            <div className="mt-7 max-w-[32rem] space-y-4 text-[15px] leading-8 text-[#6d5a4b] sm:text-[16px]">
              <p>Ju는 일상의 순간에서 피어나는 빛을 오래도록 간직할 수 있도록, 정교한 디자인과 정성스러운 손길로 주얼리를 만듭니다.</p>
              <p>유행이 아닌 본질에 집중하여, 당신의 이야기가 빛나는 주얼리를 선사합니다.</p>
            </div>
          </div>

          <ShowcaseImage
            src="/img/ju-store/ju-store-counter-panel.jpg"
            alt="JU JEWELRY 매장 쇼케이스"
            className="overflow-hidden rounded-[2px] border border-[#e3d6c8] bg-[#efe7dc] min-h-[300px] md:min-h-[380px]"
            imageClassName="object-cover object-center"
          />
        </div>

        <div className="mx-auto mt-10 max-w-[1320px] px-2 md:mt-12 md:px-0">
          <div className="grid divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] md:grid-cols-3 md:divide-x md:divide-y-0">
            {values.map((item) => {
              const Icon = item.Icon

              return (
                <article
                  key={item.title}
                  className="px-2 py-8 md:px-8 md:py-10"
                >
                  <div className="flex items-center gap-4 text-[#a07d5f]">
                    <span className="text-[14px] font-medium tracking-[0.18em]">{item.number}</span>
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-[1.25rem] font-semibold leading-[1.4] text-[#46352a]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#7a6858]">
                    {item.body[0]}
                    <br />
                    {item.body[1]}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-8 md:pb-16">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden border border-[#dbcdbf] md:grid-cols-[0.92fr_1.08fr]">
          <div className="bg-[#3a2b23] px-6 py-8 text-white sm:px-8 sm:py-10 md:px-10 md:py-12">
            <h2 className="text-[2.3rem] font-semibold leading-[1.25] sm:text-[2.7rem]">
              시간이 지나도
              <br />
              변하지 않는 가치
            </h2>
            <p className="mt-5 max-w-[360px] text-[15px] leading-8 text-white/78">
              트렌드가 아닌 본질에 집중합니다. 불필요한 장식을 덜어내고, 빛과 균형, 그리고 착용감까지 완성도 높게 설계합니다.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-3 border border-[#bea58d] px-6 py-4 text-[13px] tracking-[0.08em] text-[#f0e5da] transition-colors hover:bg-white/5"
            >
              시그니처 컬렉션 보기
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
          </div>

          <ShowcaseImage
            src="/img/about-generated/about-signature-banner.png"
            alt="브랜드 스토리 시그니처 주얼리"
            className="min-h-[280px] md:min-h-[360px]"
            imageClassName="object-cover object-center"
          />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col gap-4 border-t border-[#dfd0bf] pt-10 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[420px] text-[2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.55rem]">
              정교함이 만드는 차이
            </h2>
            <p className="max-w-[560px] text-[15px] leading-7 text-[#776352]">
              엄선된 소재와 세밀한 손길로 완성되는 Ju의 주얼리. 작은 디테일이 빛의 차이를 만듭니다.
            </p>
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {detailCards.map((card) => (
              <article key={card.title}>
                <ShowcaseImage
                  src={card.image}
                  alt={card.title}
                  className="aspect-[1.45/1] overflow-hidden border border-[#dfd0bf]"
                  imageClassName={cn('object-cover', card.position)}
                />
                <div className="pt-5">
                  <h3 className="text-[1.25rem] font-semibold leading-none text-[#46352a]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-6 text-[#7a6858]">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-[1320px] border-y border-[#dfd0bf] px-2 py-10 sm:px-4 md:px-6">
          <div>
            <h2 className="text-[2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.45rem]">
              당신에게 닿기까지의 여정
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 md:mt-10 md:grid-cols-4 md:gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.Icon

              return (
                <div key={step.number} className="relative text-center md:px-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c7b6] text-[15px] text-[#9f7e63]">
                    {step.number}
                  </div>
                  <div className="mt-5 flex justify-center text-[#b18a69]">
                    <Icon size={30} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-[1.35rem] font-semibold leading-none text-[#46352a]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-6 text-[#7a6858]">{step.description}</p>
                  {index < processSteps.length - 1 ? (
                    <span className="absolute right-[-0.55rem] top-[2.6rem] hidden text-[#b69c84] md:block">
                      <ArrowRight size={18} strokeWidth={1.4} />
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden border border-[#dbcdbf] md:grid-cols-[1.05fr_0.95fr]">
          <ShowcaseImage
            src="/img/about-generated/about-model-close.png"
            alt="목걸이를 착용한 모델"
            className="min-h-[360px] md:min-h-[440px]"
            imageClassName="object-cover object-center"
          />

          <div className="flex items-center bg-[#3a2b23] px-6 py-8 text-white sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="max-w-[420px]">
              <h2 className="text-[2.2rem] font-semibold leading-[1.28] sm:text-[2.55rem]">
                <span className="block">일상 속, 빛나는</span>
                <span className="block">순간을 함께</span>
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-white/78">
                작은 빛 하나가 기분을 바꾸고, 당신의 하루를 특별하게 만듭니다. Ju의 주얼리는 언제나 당신의 곁에서 가장 빛나는 순간을 함께합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-0 pt-4 sm:px-6 md:px-8 md:pt-8">
        <div className="mx-auto grid max-w-[1440px] overflow-hidden border border-[#decfbe] bg-[#f8f3ed] md:grid-cols-[0.92fr_1.08fr_0.82fr]">
          <ShowcaseImage
            src="/img/about-generated/about-cta-gift.png"
            alt="브랜드 스토리 상담 패키지"
            className="min-h-[220px]"
            imageClassName="object-cover object-center"
          />

          <div className="flex items-center px-6 py-8 sm:px-8 sm:py-10 md:px-10">
            <div>
              <h2 className="text-[2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.45rem]">
                <span className="block">당신의 빛나는 이야기를</span>
                <span className="block">시작하세요</span>
              </h2>
              <p className="mt-5 max-w-[440px] text-[15px] leading-7 text-[#71604f]">
                Ju의 컬렉션과 상담을 통해 당신만의 특별한 주얼리를 만나보세요.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 border-t border-[#decfbe] px-6 py-6 sm:gap-4 sm:px-8 sm:py-8 md:border-l md:border-t-0">
            <Link
              href="/products"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 bg-[#4b382d] px-6 text-[14px] tracking-[0.08em] text-white transition-colors hover:bg-[#3f2f26]"
            >
              컬렉션 보기
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 border border-[#bba188] bg-white px-6 text-[14px] tracking-[0.08em] text-[#5f4b3d] transition-colors hover:bg-[#faf6f1]"
            >
              상담 예약
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#3a2b23] text-[#ede1d5]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-10 sm:px-8 md:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr_1fr] md:px-10">
          <div>
            <p className="brand-wordmark text-[2.25rem] leading-none tracking-[0.08em] text-white">Ju</p>
            <p className="mt-4 max-w-[260px] text-[14px] leading-7 text-white/70">
              빛을 담은 순간으로 당신의 일상에 잔잔한 여운을 더합니다.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.Icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 text-white/82 transition-colors hover:border-white/28 hover:text-white"
                  >
                    <Icon size={18} strokeWidth={1.7} />
                  </Link>
                )
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="hidden md:block">
              <p className="text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2 text-[14px] leading-7 text-white/68">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">
              CONTACT
            </p>
            <ul className="mt-4 space-y-2 text-[14px] leading-7 text-white/68">
              <li>{settings.phonePrimary}</li>
              {settings.phoneSecondary ? <li>{settings.phoneSecondary}</li> : null}
              <li>{settings.businessHours}</li>
              <li>{settings.email}</li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-5 text-[13px] text-white/48 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10">
            <p>© Ju Jewelry. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/terms" className="transition-colors hover:text-white/72">
                이용약관
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-white/72">
                개인정보처리방침
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white/72">
                상담 문의
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
