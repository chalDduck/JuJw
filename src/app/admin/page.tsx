import Link from 'next/link'
import {
  ChevronRight,
  CircleHelp,
  Home,
  Megaphone,
  Package2,
  PhoneCall,
  Settings as SettingsIcon,
} from 'lucide-react'
import AdminShortcutInstall from '@/components/admin/AdminShortcutInstall'
import { getDashboardSummary } from '@/lib/db'

export const dynamic = 'force-dynamic'

const menu = [
  { href: '/admin/products', title: '제품 관리', description: '제품을 등록하고 사진을 올립니다.', Icon: Package2 },
  { href: '/admin/inquiries', title: '문의 확인', description: '받은 상담을 보고 전화를 겁니다.', Icon: PhoneCall },
  { href: '/admin/notices', title: '공지사항', description: '휴무·신상품 소식을 올립니다.', Icon: Megaphone },
  { href: '/admin/home', title: '홈 문구 수정', description: '메인 화면 문구를 바꿉니다.', Icon: Home },
  { href: '/admin/faq', title: '자주 묻는 질문', description: '질문과 답변을 정리합니다.', Icon: CircleHelp },
  { href: '/admin/settings', title: '매장 정보', description: '연락처·주소·영업시간을 바꿉니다.', Icon: SettingsIcon },
]

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary().catch(() => ({
    productCount: 0,
    pendingInquiryCount: 0,
    totalInquiryCount: 0,
    noticeCount: 0,
  }))

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {summary.pendingInquiryCount > 0 ? (
        <Link
          href="/admin/inquiries"
          className="flex items-center justify-between gap-4 rounded-3xl border-2 border-amber-300 bg-amber-50 p-5 transition active:translate-y-px sm:p-6"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-white">
              <PhoneCall size={26} strokeWidth={2} />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-amber-900">아직 연락 안 한 문의</p>
              <p className="mt-0.5 text-[22px] font-bold text-amber-900">{summary.pendingInquiryCount}건</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-2xl bg-amber-500 px-4 py-3 text-[15px] font-bold text-white">
            확인
            <ChevronRight size={18} strokeWidth={2.2} />
          </span>
        </Link>
      ) : (
        <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6">
          <p className="text-[16px] font-semibold text-stone-800">오늘도 수고 많으십니다 👋</p>
          <p className="mt-1 text-[15px] leading-7 text-stone-500">
            아래 큰 버튼을 눌러 원하는 작업을 시작하세요. 모르겠으면 “제품 관리”부터 보시면 됩니다.
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <SummaryStat label="등록 제품" value={summary.productCount} />
        <SummaryStat label="전체 문의" value={summary.totalInquiryCount} />
        <SummaryStat label="공지" value={summary.noticeCount} />
      </div>

      <AdminShortcutInstall />

      <div className="grid gap-3 sm:grid-cols-2">
        {menu.map((item) => {
          const Icon = item.Icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-5 transition active:translate-y-px hover:border-stone-400 hover:bg-stone-50 sm:p-6"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
                <Icon size={26} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[19px] font-bold tracking-tight text-stone-950">{item.title}</p>
                <p className="mt-0.5 text-[14px] leading-6 text-stone-500">{item.description}</p>
              </div>
              <ChevronRight size={22} strokeWidth={2} className="shrink-0 text-stone-400" />
            </Link>
          )
        })}
      </div>

      <p className="px-1 pb-2 text-center text-[13px] leading-6 text-stone-400">
        화면이 어렵게 느껴지면 각 항목을 눌러 하나씩 천천히 진행하세요.
      </p>
    </div>
  )
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-3 py-4 text-center">
      <p className="text-[28px] font-bold leading-none tracking-tight text-stone-950">{value}</p>
      <p className="mt-2 text-[13px] font-semibold text-stone-500">{label}</p>
    </div>
  )
}
