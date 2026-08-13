'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import {
  ChevronLeft,
  CircleHelp,
  ExternalLink,
  Home,
  LayoutDashboard,
  Megaphone,
  Package2,
  PhoneCall,
  Settings as SettingsIcon,
} from 'lucide-react'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

const navItems = [
  { href: '/admin', label: '관리자 홈', icon: LayoutDashboard },
  { href: '/admin/products', label: '제품', icon: Package2 },
  { href: '/admin/inquiries', label: '문의', icon: PhoneCall },
  { href: '/admin/notices', label: '공지사항', icon: Megaphone },
  { href: '/admin/home', label: '홈 화면 글', icon: Home },
  { href: '/admin/faq', label: '자주 묻는 질문', icon: CircleHelp },
  { href: '/admin/settings', label: '매장 정보', icon: SettingsIcon },
]

const routeMeta = [
  { match: '/admin/products', title: '제품 관리', description: '제품 등록과 사진, 홈 추천 노출을 한 화면에서 처리합니다.' },
  { match: '/admin/inquiries', title: '문의 확인', description: '받은 상담을 확인하고 바로 전화를 겁니다.' },
  { match: '/admin/notices', title: '공지사항', description: '휴무, 신상품, 이벤트 소식을 올립니다.' },
  { match: '/admin/home', title: '홈 문구 수정', description: '메인 화면에 보이는 문구를 바꿉니다.' },
  { match: '/admin/faq', title: '자주 묻는 질문', description: 'FAQ 페이지의 질문과 답변을 관리합니다.' },
  { match: '/admin/settings', title: '매장 정보', description: '연락처, 주소, 영업시간, SNS를 관리합니다.' },
  { match: '/admin', title: '관리자 홈', description: '오늘 할 일을 한눈에 확인합니다.' },
]

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href)
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const isDashboard = pathname === '/admin'
  const currentRoute = useMemo(
    () =>
      routeMeta.find((item) =>
        item.match === '/admin' ? pathname === item.match : pathname.startsWith(item.match)
      ) ?? routeMeta[routeMeta.length - 1],
    [pathname]
  )

  useEffect(() => {
    document.body.classList.add('admin-page')
    return () => document.body.classList.remove('admin-page')
  }, [])

  if (isLogin) {
    return <div data-admin-page>{children}</div>
  }

  return (
    <div data-admin-page className="admin-flat-shell min-h-[100dvh] bg-[#f3f0ea] text-stone-950 lg:h-screen lg:overflow-hidden">
      <div className="lg:grid lg:h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* 데스크탑 사이드바 */}
        <aside className="hidden border-r border-stone-200 bg-[#211a16] text-white lg:flex lg:min-h-0 lg:flex-col">
          <div className="px-6 py-6">
            <Link href="/admin" className="block">
              <span className="text-[12px] font-semibold uppercase tracking-[0.28em] text-white/45">JU JEWELRY</span>
              <span className="mt-2 block text-2xl font-semibold tracking-tight">관리자 화면</span>
            </Link>
          </div>

          <nav className="min-h-0 flex-1 space-y-1.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-[56px] items-center gap-3 rounded-2xl px-4 text-[17px] font-semibold transition active:translate-y-px ${
                    active ? 'bg-white text-stone-950' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.9} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="space-y-3 border-t border-white/10 p-4">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-[52px] items-center justify-between rounded-2xl border border-white/10 px-4 text-[15px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              내 홈페이지 보기
              <ExternalLink size={18} />
            </Link>
            <AdminLogoutButton variant="dark" />
          </div>
        </aside>

        {/* 본문 영역 */}
        <div className="min-w-0 lg:flex lg:h-screen lg:min-h-0 lg:flex-col">
          {/* 모바일/공통 상단바 */}
          <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#f8f6f1]/97 backdrop-blur lg:static lg:shrink-0">
            <div className="flex min-h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-2">
                {!isDashboard ? (
                  <Link
                    href="/admin"
                    className="inline-flex min-h-[48px] items-center gap-1 rounded-2xl bg-stone-900 pl-2 pr-4 text-[16px] font-semibold text-white transition active:translate-y-px lg:hidden"
                  >
                    <ChevronLeft size={22} strokeWidth={2} />
                    관리자 홈
                  </Link>
                ) : null}
                <div className="min-w-0">
                  <h1 className="truncate text-[20px] font-bold tracking-tight text-stone-950 sm:text-2xl">
                    {currentRoute.title}
                  </h1>
                </div>
              </div>
              <Link
                href="/"
                target="_blank"
                className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 text-[15px] font-semibold text-stone-700 transition active:translate-y-px hover:border-stone-400"
              >
                <span>사이트 보기</span>
                <ExternalLink size={18} />
              </Link>
            </div>
            <p className="border-t border-stone-200 px-4 py-2.5 text-[16px] leading-6 text-stone-600 sm:px-6 lg:px-8">
              {currentRoute.description}
            </p>
          </header>

          <main className="min-w-0 px-4 pb-12 pt-5 sm:px-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-8 lg:pb-8 lg:pt-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
