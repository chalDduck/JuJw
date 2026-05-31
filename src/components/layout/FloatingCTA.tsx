'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KAKAO_OPENCHAT_URL } from '@/lib/site-links'

const DEFAULT_PHONE = '02-744-6268'

export default function FloatingCTA() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [phone, setPhone] = useState(DEFAULT_PHONE)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.65)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    let active = true
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const value = data?.settings?.phone_primary
        if (active && value) setPhone(value)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  // 관리자 화면에서는 노출하지 않음
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const telHref = `tel:${phone.replace(/[^0-9+]/g, '')}`

  const items = [
    { key: 'kakao', label: '카톡상담', href: KAKAO_OPENCHAT_URL, external: true, Icon: MessageCircle },
    { key: 'call', label: '전화상담', href: telHref, external: true, Icon: Phone },
    { key: 'map', label: '오시는길', href: '/location', external: false, Icon: MapPin },
  ] as const

  return (
    <div
      data-floating-cta
      className={cn(
        'fixed inset-x-0 bottom-0 z-[60] transition-all duration-300 sm:inset-x-auto sm:bottom-7 sm:right-7',
        show
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-5 opacity-0'
      )}
    >
      {/* 모바일: 하단 고정 바 */}
      <div
        className="border-t border-[#5d4738] bg-[#241710]/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="grid grid-cols-3">
          {items.map((item) => {
            const Icon = item.Icon
            const inner = (
              <>
                <Icon size={21} strokeWidth={1.7} className="text-[#dcb888]" />
                <span className="text-[12px] font-medium tracking-[0.02em]">{item.label}</span>
              </>
            )
            const className =
              'flex min-h-[62px] flex-col items-center justify-center gap-1 text-[#f3e5d3] transition-colors active:bg-white/5'
            return item.external ? (
              <a
                key={item.key}
                href={item.href}
                target={item.key === 'kakao' ? '_blank' : undefined}
                rel={item.key === 'kakao' ? 'noreferrer' : undefined}
                className={cn(className, item.key === 'call' && 'border-x border-white/10')}
              >
                {inner}
              </a>
            ) : (
              <Link key={item.key} href={item.href} className={className}>
                {inner}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 데스크탑: 우하단 플로팅 버튼 */}
      <div className="hidden flex-col gap-2.5 sm:flex">
        {items.map((item) => {
          const Icon = item.Icon
          const isPrimary = item.key === 'kakao'
          const inner = (
            <>
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[14px] font-semibold tracking-[0.02em]">{item.label}</span>
            </>
          )
          const className = cn(
            'inline-flex min-w-[150px] items-center gap-2.5 rounded-full px-5 py-3.5 shadow-[0_14px_30px_-14px_rgba(20,12,6,0.7)] transition-colors',
            isPrimary
              ? 'bg-[#b9925f] text-[#241710] hover:bg-[#c8a06b]'
              : 'border border-[#5d4738] bg-[#241710]/95 text-[#f0dec9] backdrop-blur hover:bg-[#33271f]'
          )
          return item.external ? (
            <a
              key={item.key}
              href={item.href}
              target={item.key === 'kakao' ? '_blank' : undefined}
              rel={item.key === 'kakao' ? 'noreferrer' : undefined}
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link key={item.key} href={item.href} className={className}>
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
