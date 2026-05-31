'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CarFront,
  Clock3,
  Facebook,
  Instagram,
  MapPinned,
  Menu,
  Phone,
  TrainFront,
  UserRound,
  X,
} from 'lucide-react'
import ShowcaseImage from '@/components/media/ShowcaseImage'
import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/lib/site-settings'

type LocationVisitPageProps = {
  settings: SiteSettings
}

const navigation = [
  { label: '컬렉션', href: '/products' },
  { label: '브랜드 스토리', href: '/about' },
  { label: '거래 안내', href: '/trade' },
  { label: '오시는 길', href: '/location' },
  { label: 'FAQ', href: '/faq' },
] as const

const directions = [
  {
    title: '지하철',
    body: '종로3가역 인근에서 도보 이동이 가능하도록 안내합니다. 예약 시 가장 빠른 출구 기준으로 다시 정리해 드립니다.',
    Icon: TrainFront,
  },
  {
    title: '버스',
    body: '종로 일대 정류장 기준으로 하차 후 이동 동선을 안내합니다. 도착 위치에 따라 가장 가까운 정류장을 함께 알려드립니다.',
    Icon: MapPinned,
  },
  {
    title: '자가용',
    body: '인근 공영주차장 또는 방문 가능 시간대를 기준으로 안내합니다. 차량 방문 시 사전에 알려주시면 더 빠르게 도와드립니다.',
    Icon: CarFront,
  },
] as const

const visitChecks = [
  '방문 전 연락을 주시면 상담 가능 시간을 먼저 확인해 드립니다.',
  '대기 없이 상담하려면 예약 후 방문하는 편이 가장 안정적입니다.',
  '주차나 하차 위치가 필요한 경우 도착 전 한 번 더 연락해 주세요.',
] as const

const footerColumns = [
  {
    title: 'SHOP',
    items: ['컬렉션', '목걸이', '귀걸이', '반지', '팔찌'],
  },
  {
    title: 'GUIDE',
    items: ['오시는 길', '거래 안내', 'FAQ', '상담 문의'],
  },
  {
    title: 'ABOUT',
    items: ['브랜드 스토리', '방문 예약', '운영시간', '연락처'],
  },
] as const

export default function LocationVisitPage({ settings }: LocationVisitPageProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('location-reference-page')

    return () => {
      document.body.classList.remove('location-reference-page')
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
    { href: settings.facebookUrl || '/contact', label: 'Facebook', Icon: Facebook },
  ]

  // 구글 지도: 주소에서 호수(예: ", 143호")를 떼고 건물 주소로 검색
  const mapQuery = settings.address.split(',')[0]?.trim() || settings.address
  const googleMapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&hl=ko&z=17&output=embed`
  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

  return (
    <div data-location-shell className="bg-[#f6f1ea] text-[#433228]">
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
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#d8b78c]">Explore</p>
            <nav className="mt-5 border-t border-white/10">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between border-b border-white/10 py-5"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-[1.55rem] font-semibold leading-none">{item.label}</span>
                  <span className="text-[11px] tracking-[0.24em] text-white/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] leading-7 text-white/70">
              방문 시간 확인과 길 안내가 필요하면 문의 페이지에서 바로 예약할 수 있습니다.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-3 border border-[#c59a69] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e3cb]"
              onClick={() => setMenuOpen(false)}
            >
              방문 예약
              <ArrowRight size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </aside>
      </div>

      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#5d483a] sm:min-h-[620px] md:min-h-[760px]">
        <ShowcaseImage
          src="/img/location-generated/location-hero-desktop.png"
          mobileSrc="/img/location-generated/location-hero-mobile.png"
          alt="오시는 길 히어로 이미지"
          loading="eager"
          className="absolute inset-0 h-full w-full bg-[#5d483a]"
          imageClassName="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(62,45,34,0.82)_0%,rgba(62,45,34,0.54)_38%,rgba(62,45,34,0.18)_100%)]" />

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
          <div className="max-w-[470px] text-white">
            <div className="mb-5 flex items-center gap-4 text-[#dfc7aa]">
              <span className="h-px w-12 bg-current/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-current/80" />
              <span className="h-px w-20 bg-current/35" />
            </div>
            <h1 className="text-[2.65rem] font-semibold leading-[1.14] sm:text-[4.1rem]">오시는 길</h1>
            <p className="mt-6 text-[1rem] leading-8 text-[#f1e6da] sm:text-[1.12rem] sm:leading-9">
              주소와 운영시간, 이동 방법을
              <br />
              한 번에 확인할 수 있게 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e4d9cd] bg-[#fbf8f4]">
        <div className="mx-auto grid max-w-[1320px] gap-0 px-4 py-5 sm:px-6 md:grid-cols-4 md:px-8">
          <article className="border-b border-[#e7ddd1] px-4 py-5 md:border-b-0 md:border-r md:px-6">
            <p className="text-[14px] font-semibold text-[#5d483a]">주소</p>
            <p className="mt-2 text-[13px] leading-6 text-[#7a6858]">{settings.address}</p>
          </article>
          <article className="border-b border-[#e7ddd1] px-4 py-5 md:border-b-0 md:border-r md:px-6">
            <p className="text-[14px] font-semibold text-[#5d483a]">운영시간</p>
            <p className="mt-2 text-[13px] leading-6 text-[#7a6858]">{settings.businessHours}</p>
          </article>
          <article className="border-b border-[#e7ddd1] px-4 py-5 md:border-b-0 md:border-r md:px-6">
            <p className="text-[14px] font-semibold text-[#5d483a]">방문 권장</p>
            <p className="mt-2 text-[13px] leading-6 text-[#7a6858]">상담 대기 없이 보려면 예약 후 방문하는 편이 가장 안정적입니다.</p>
          </article>
          <article className="px-4 py-5 md:px-6">
            <p className="text-[14px] font-semibold text-[#5d483a]">지도 이동</p>
            <a
              href={settings.naverMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-[13px] leading-6 text-[#7a6858] underline underline-offset-4"
            >
              네이버 지도 열기
              <ArrowRight size={14} strokeWidth={1.7} />
            </a>
          </article>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-8 md:grid-cols-[0.96fr_1.04fr] md:items-center md:gap-10">
          <div className="px-2 md:px-0">
            <h2 className="text-[2.2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.85rem]">
              방문 전에 필요한 정보만 간단하게
            </h2>
            <div className="mt-5 h-px w-16 bg-[#d0b69b]" />
            <div className="mt-7 max-w-[34rem] space-y-4 text-[15px] leading-8 text-[#6d5a4b] sm:text-[16px]">
              <p>오시는 길 페이지는 실제로 방문 직전에 확인하는 정보가 중심입니다. 주소, 지도, 운영시간, 연락 방법을 먼저 보이게 두었습니다.</p>
              <p>예약 없이 방문할 수 있어도, 상담 시간 확인 후 이동하면 대기 시간을 줄일 수 있습니다.</p>
            </div>
            <div className="mt-8 space-y-3 border-t border-[#e4d6c7] pt-6 text-[14px] leading-7 text-[#6b594a]">
              <p><span className="font-semibold text-[#433228]">전화</span> {settings.phonePrimary}</p>
              {settings.phoneSecondary ? <p><span className="font-semibold text-[#433228]">모바일</span> {settings.phoneSecondary}</p> : null}
              <p><span className="font-semibold text-[#433228]">휴무</span> {settings.closedDay}</p>
            </div>
          </div>

          <div className="min-h-[300px] overflow-hidden border border-[#e3d6c8] bg-[#efe7dc] md:min-h-[420px]">
            <iframe
              title={`구글 지도 - ${mapQuery}`}
              src={googleMapEmbed}
              className="h-full min-h-[300px] w-full md:min-h-[420px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-8 md:pb-16">
        <div className="mx-auto grid max-w-[1320px] divide-y divide-[#dfd0bf] border-y border-[#dfd0bf] md:grid-cols-3 md:divide-x md:divide-y-0">
          {directions.map((item) => {
            const Icon = item.Icon

            return (
              <article
                key={item.title}
                className="px-2 py-7 md:px-8"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center border border-[#dfd1c2] text-[#9b7757]">
                  <Icon size={21} strokeWidth={1.7} />
                </div>
                <h3 className="mt-5 text-[1.35rem] font-semibold leading-[1.35] text-[#433228]">{item.title}</h3>
                <p className="mt-4 text-[14px] leading-7 text-[#7a6858]">{item.body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden border border-[#dbcdbf] md:grid-cols-[1.02fr_0.98fr]">
          <div className="flex items-center bg-[#3a2b23] px-6 py-8 text-white sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="max-w-[430px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[12px] text-[#e4d2c3]">
                <Clock3 size={15} strokeWidth={1.7} />
                방문 체크
              </div>
              <h2 className="mt-6 text-[2.2rem] font-semibold leading-[1.28] sm:text-[2.55rem]">
                도착 전 한 번만 더 확인하면 충분합니다
              </h2>
              <ul className="mt-6 space-y-4 text-[14px] leading-7 text-white/78">
                {visitChecks.map((item) => (
                  <li key={item} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-center divide-y divide-[#dfd0bf] bg-[#f8f3ed] px-6 py-6 sm:px-8 sm:py-8 md:px-10">
            <div className="flex items-start gap-4 py-5 first:pt-0">
              <div className="mt-1 text-[#9b7757]">
                <MapPinned size={18} strokeWidth={1.7} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#433228]">지도 이동</p>
                <p className="mt-2 text-[14px] leading-7 text-[#7a6858]">지도 앱에서 바로 이동하려면 아래 버튼으로 네이버 지도를 여는 것이 가장 빠릅니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-5">
              <div className="mt-1 text-[#9b7757]">
                <Phone size={18} strokeWidth={1.7} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#433228]">연락 확인</p>
                <p className="mt-2 text-[14px] leading-7 text-[#7a6858]">길 안내나 도착 시간 조정이 필요하면 이동 중에도 바로 연락하실 수 있습니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-5 last:pb-0">
              <div className="mt-1 text-[#9b7757]">
                <UserRound size={18} strokeWidth={1.7} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#433228]">방문 예약</p>
                <p className="mt-2 text-[14px] leading-7 text-[#7a6858]">제품 상담까지 함께 보려면 예약 후 방문하는 쪽이 흐름이 가장 좋습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-0 pt-4 sm:px-6 md:px-8 md:pt-8">
        <div className="mx-auto grid max-w-[1440px] overflow-hidden border border-[#decfbe] bg-[#f8f3ed] md:grid-cols-[0.92fr_1.08fr_0.84fr]">
          <ShowcaseImage
            src="/img/location-generated/location-cta-panel.png"
            alt="오시는 길 상담 이미지"
            className="min-h-[220px]"
            imageClassName="object-cover object-center"
          />

          <div className="flex items-center px-6 py-8 sm:px-8 sm:py-10 md:px-10">
            <div>
              <h2 className="text-[2rem] font-semibold leading-[1.28] text-[#3e2d23] sm:text-[2.45rem]">
                길 안내와 방문 시간은 바로 확인할 수 있습니다
              </h2>
              <p className="mt-5 max-w-[440px] text-[15px] leading-7 text-[#71604f]">
                주소, 운영시간, 연락처를 확인한 뒤 지도 이동 또는 방문 예약으로 바로 이어질 수 있게 정리했습니다.
              </p>
              <div className="mt-6 space-y-2 text-[14px] leading-6 text-[#6d5a4b]">
                <p>{settings.address}</p>
                <p>{settings.businessHours}</p>
                <p>{settings.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 border-t border-[#decfbe] px-6 py-6 sm:gap-4 sm:px-8 sm:py-8 md:border-l md:border-t-0">
            <a
              href={googleMapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 bg-[#4b382d] px-6 text-[14px] tracking-[0.08em] text-white transition-colors hover:bg-[#3f2f26]"
            >
              구글 지도 열기
              <ArrowRight size={16} strokeWidth={1.7} />
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 border border-[#bba188] bg-white px-6 text-[14px] tracking-[0.08em] text-[#5f4b3d] transition-colors hover:bg-[#faf6f1]"
            >
              방문 예약
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
              이동 정보와 상담 흐름을 같은 톤으로 정리해, 방문 전 확인이 빠르게 끝나도록 구성했습니다.
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
            <div key={column.title}>
              <p className="text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">{column.title}</p>
              <ul className="mt-4 space-y-2 text-[14px] leading-7 text-white/68">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[13px] font-medium tracking-[0.14em] text-[#d3b89c]">CONTACT</p>
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
