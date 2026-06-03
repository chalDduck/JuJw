'use client'

import { useEffect } from 'react'
import { useRef } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

type GoogleAnalyticsProps = {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)

  useEffect(() => {
    if (!measurementId) {
      return
    }

    const pagePath = `${window.location.pathname}${window.location.search}`
    if (!lastTrackedPath.current) {
      lastTrackedPath.current = pagePath
      return
    }

    if (lastTrackedPath.current === pagePath || !window.gtag) {
      return
    }

    window.gtag('config', measurementId, {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    })
    lastTrackedPath.current = pagePath
  }, [measurementId, pathname])

  if (!measurementId) {
    return null
  }

  const measurementIdJson = JSON.stringify(measurementId)

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', ${measurementIdJson});
        `}
      </Script>
    </>
  )
}
