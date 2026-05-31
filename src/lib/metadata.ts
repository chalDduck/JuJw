import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/env'

export const siteName = 'JU JEWELRY'
export const defaultOgImage = '/og-image.png'
export const defaultOgImageAlt = 'JU JEWELRY 주얼리 쇼룸'

interface PageMetadataOptions {
  title: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
}

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image = defaultOgImage,
  imageAlt = defaultOgImageAlt,
}: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl().replace(/\/$/, '')
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`
  const resolvedTitle = title === siteName ? title : `${title} | ${siteName}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: resolvedTitle,
      description,
      siteName,
      locale: 'ko_KR',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [image],
    },
  }
}
