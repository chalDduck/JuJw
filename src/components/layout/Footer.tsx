import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'
import { getPublicSettings } from '@/lib/db'
import { getContactLines, normalizeSiteSettings } from '@/lib/site-settings'

export default async function Footer() {
  const settings = normalizeSiteSettings(await getPublicSettings())
  const contactLines = getContactLines(settings)

  return (
    <footer data-site-footer className="border-t border-white/10 bg-stone-900 py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mb-20 md:grid-cols-4 md:gap-16">
          <div className="md:col-span-1">
            <h2
              className="mb-4 text-2xl font-light italic tracking-tight text-white md:mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {settings.shopName}
            </h2>
            <p className="mb-4 text-sm font-light leading-relaxed text-stone-400">
              종로 귀금속 도매 전문점
            </p>
            {settings.businessName || settings.businessNumber || settings.representativeName ? (
              <p className="text-xs leading-6 text-stone-500">
                {[settings.businessName, settings.representativeName, settings.businessNumber]
                  .filter(Boolean)
                  .join(' / ')}
              </p>
            ) : null}
            {settings.instagramUrl || settings.facebookUrl ? (
              <div className="mt-4 flex gap-2">
                {settings.instagramUrl ? (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 text-stone-500 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <Instagram size={18} />
                  </a>
                ) : null}
                {settings.facebookUrl ? (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 text-stone-500 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <Facebook size={18} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="hidden sm:block">
            <h4 className="mb-4 text-sm font-normal tracking-wide text-white md:mb-6">메뉴</h4>
            <ul className="space-y-2 text-sm font-light md:space-y-3">
              <li>
                <Link href="/" className="inline-flex min-h-[36px] items-center text-stone-400 transition-colors hover:text-white">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/products" className="inline-flex min-h-[36px] items-center text-stone-400 transition-colors hover:text-white">
                  제품
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-flex min-h-[36px] items-center text-stone-400 transition-colors hover:text-white">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/notices" className="inline-flex min-h-[36px] items-center text-stone-400 transition-colors hover:text-white">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/location" className="inline-flex min-h-[36px] items-center text-stone-400 transition-colors hover:text-white">
                  오시는 길
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden sm:block">
            <h4 className="mb-4 text-sm font-normal tracking-wide text-white md:mb-6">서비스</h4>
            <ul className="space-y-2 text-sm font-light text-stone-400 md:space-y-3">
              <li>도매 거래</li>
              <li>맞춤 제작</li>
              <li>사업자 상담</li>
              <li>품질 보증</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-normal tracking-wide text-white md:mb-6">연락처</h4>
            <ul className="space-y-2 text-sm font-light text-stone-400 md:space-y-3">
              {contactLines.map((line) => {
                const href = line.includes('@')
                  ? `mailto:${line}`
                  : `tel:${line.replace(/[^\d+]/g, '')}`

                return (
                  <li key={line}>
                    <a
                      href={href}
                      className="inline-flex min-h-[36px] items-center transition-colors hover:text-white"
                    >
                      {line}
                    </a>
                  </li>
                )
              })}
              {settings.address ? <li>{settings.address}</li> : null}
              {settings.businessHours ? <li>{settings.businessHours}</li> : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center">
          <p className="font-light text-stone-500">
            &copy; 2026 {settings.shopName}. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap gap-5 font-light text-stone-500 sm:gap-8">
            <Link href="/privacy" className="inline-flex min-h-[36px] items-center transition-colors hover:text-white">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="inline-flex min-h-[36px] items-center transition-colors hover:text-white">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
