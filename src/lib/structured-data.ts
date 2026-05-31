import { getSiteUrl } from '@/lib/env'
import type { SiteSettings } from '@/lib/site-settings'

const DEFAULT_IMAGE = '/og-image.png'

function siteRoot(): string {
  return getSiteUrl().replace(/\/$/, '')
}

function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${siteRoot()}${path.startsWith('/') ? path : `/${path}`}`
}

function socialLinks(settings: SiteSettings): string[] {
  return [settings.instagramUrl, settings.facebookUrl].filter((url): url is string =>
    Boolean(url && url.startsWith('http'))
  )
}

export function buildOrganizationJsonLd(settings: SiteSettings): Record<string, unknown> {
  const root = siteRoot()

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${root}/#organization`,
    name: settings.shopName || 'JU JEWELRY',
    url: root,
    logo: absoluteUrl('/icon.png'),
    image: absoluteUrl(DEFAULT_IMAGE),
    telephone: settings.phonePrimary,
    email: settings.email,
    sameAs: socialLinks(settings),
  }
}

export function buildWebSiteJsonLd(settings: SiteSettings): Record<string, unknown> {
  const root = siteRoot()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${root}/#website`,
    name: settings.shopName || 'JU JEWELRY',
    url: root,
    inLanguage: 'ko-KR',
    publisher: {
      '@id': `${root}/#organization`,
    },
  }
}

export function buildJewelryStoreJsonLd(settings: SiteSettings): Record<string, unknown> {
  const root = siteRoot()

  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    '@id': `${root}/#jewelrystore`,
    name: settings.shopName || 'JU JEWELRY',
    url: root,
    image: absoluteUrl(DEFAULT_IMAGE),
    logo: absoluteUrl('/icon.png'),
    telephone: settings.phonePrimary,
    email: settings.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: '종로구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
    openingHours: settings.businessHours,
    areaServed: ['서울', '종로', '대한민국'],
    sameAs: socialLinks(settings),
    parentOrganization: {
      '@id': `${root}/#organization`,
    },
  }
}
