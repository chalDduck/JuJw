'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, Download, MonitorDown, Smartphone } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type AdminShortcutInstallProps = {
  compact?: boolean
}

const ADMIN_URL = 'https://jujewelry.com/admin'

function isStandaloneMode() {
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isAndroidDevice() {
  return /android/i.test(window.navigator.userAgent)
}

export default function AdminShortcutInstall({ compact = false }: AdminShortcutInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideType, setGuideType] = useState<'ios' | 'android' | 'desktop'>('desktop')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setInstalled(isStandaloneMode())
    setGuideType(isIosDevice() ? 'ios' : isAndroidDevice() ? 'android' : 'desktop')

    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setMessage('')
    }

    const handleInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
      setGuideOpen(false)
      setMessage('설치가 완료되었습니다. 다음부터는 아이콘을 눌러 바로 들어오시면 됩니다.')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const shortcutHref = useMemo(() => {
    const shortcut = [
      '[InternetShortcut]',
      `URL=${ADMIN_URL}`,
      'IconFile=https://jujewelry.com/favicon.ico',
      'IconIndex=0',
      '',
    ].join('\r\n')

    return `data:application/octet-stream;charset=utf-8,${encodeURIComponent(shortcut)}`
  }, [])

  const handleInstall = async () => {
    if (installed || isStandaloneMode()) {
      setInstalled(true)
      setMessage('이미 설치된 상태입니다. 바탕화면이나 홈 화면의 아이콘을 눌러 접속하시면 됩니다.')
      return
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      setDeferredPrompt(null)

      if (choice.outcome === 'accepted') {
        setInstalled(true)
        setGuideOpen(false)
        setMessage('설치가 완료되었습니다. 다음부터는 아이콘으로 바로 접속하시면 됩니다.')
      } else {
        setGuideOpen(true)
        setMessage('설치를 취소하셨습니다. 필요하면 아래 안내대로 다시 추가할 수 있습니다.')
      }
      return
    }

    setGuideOpen(true)
    setMessage('이 브라우저는 자동 설치 창을 바로 띄우지 못해 아래 방법으로 추가해 주세요.')
  }

  return (
    <section
      className={
        compact
          ? 'mt-6 border border-stone-200 bg-stone-50 p-4'
          : 'border border-stone-200 bg-white p-5 sm:p-6'
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[18px] font-bold tracking-tight text-stone-950">관리자 바로가기</p>
          <p className="mt-1 text-[14px] leading-6 text-stone-600">
            휴대폰 홈 화면이나 컴퓨터에 아이콘을 만들어 다음부터 쉽게 접속합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex min-h-[54px] shrink-0 items-center justify-center gap-2 bg-stone-900 px-5 text-[15px] font-bold text-white transition active:translate-y-px hover:bg-stone-700"
        >
          {installed ? <CheckCircle2 size={19} strokeWidth={2} /> : <Download size={19} strokeWidth={2} />}
          {installed ? '설치 완료' : '바로가기 설치'}
        </button>
      </div>

      {message ? <p className="mt-3 text-[14px] leading-6 text-stone-600">{message}</p> : null}

      {guideOpen ? (
        <div className="mt-4 border-t border-stone-200 pt-4 text-[14px] leading-7 text-stone-600">
          {guideType === 'ios' ? (
            <GuideBlock
              icon={<Smartphone size={20} strokeWidth={2} />}
              title="아이폰/아이패드"
              lines={['Safari에서 열기', '아래 공유 버튼 누르기', '홈 화면에 추가 선택']}
            />
          ) : null}

          {guideType === 'android' ? (
            <GuideBlock
              icon={<Smartphone size={20} strokeWidth={2} />}
              title="안드로이드"
              lines={['Chrome 메뉴 누르기', '홈 화면에 추가 또는 앱 설치 선택', '추가 버튼 누르기']}
            />
          ) : null}

          {guideType === 'desktop' ? (
            <GuideBlock
              icon={<MonitorDown size={20} strokeWidth={2} />}
              title="컴퓨터"
              lines={['주소창 오른쪽 설치 아이콘 누르기', '또는 Chrome/Edge 메뉴에서 앱 설치 선택', '설치 창에서 확인 누르기']}
            />
          ) : null}

          {guideType === 'desktop' ? (
            <a
              href={shortcutHref}
              download="JU JEWELRY 관리자.url"
              className="mt-3 inline-flex min-h-[44px] items-center justify-center border border-stone-300 bg-white px-4 text-[14px] font-bold text-stone-800"
            >
              Windows 바로가기 파일 받기
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function GuideBlock({
  icon,
  title,
  lines,
}: {
  icon: ReactNode
  title: string
  lines: string[]
}) {
  return (
    <div>
      <p className="flex items-center gap-2 font-bold text-stone-900">
        {icon}
        {title}
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
    </div>
  )
}
