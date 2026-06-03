'use client'

import { useCallback, useEffect, useRef } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    wcs_add?: Record<string, string>
    wcs?: unknown
    wcs_do?: () => void
  }
}

type NaverAnalyticsProps = {
  trackingId: string
}

export default function NaverAnalytics({ trackingId }: NaverAnalyticsProps) {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  const trackPage = useCallback(() => {
    if (!trackingId || !window.wcs_do) {
      return
    }

    const pagePath = `${window.location.pathname}${window.location.search}`
    if (lastTrackedPath.current === pagePath) {
      return
    }

    window.wcs_add = window.wcs_add || {}
    window.wcs_add.wa = trackingId
    window.wcs_do()
    lastTrackedPath.current = pagePath
  }, [trackingId])

  useEffect(() => {
    trackPage()
  }, [pathname, trackPage])

  if (!trackingId) {
    return null
  }

  const trackingIdJson = JSON.stringify(trackingId)

  return (
    <>
      <Script id="naver-analytics-config" strategy="afterInteractive">
        {`
          window.wcs_add = window.wcs_add || {};
          window.wcs_add["wa"] = ${trackingIdJson};
        `}
      </Script>
      <Script
        src="https://wcs.pstatic.net/wcslog.js"
        strategy="afterInteractive"
        onLoad={trackPage}
      />
    </>
  )
}
