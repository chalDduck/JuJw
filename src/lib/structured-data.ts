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

function validUrl(url: string): string | undefined {
  return url.startsWith('http') ? encodeURI(url) : undefined
}

function normalizedOpeningHours(settings: SiteSettings): string | undefined {
  const match = settings.businessHours.match(/(\d{1,2}:\d{2})\s*[-~]\s*(\d{1,2}:\d{2})/)
  if (!match) return undefined
  return `Mo-Su ${match[1]}-${match[2]}`
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  const root = siteRoot()

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http')
        ? item.path
        : `${root}${item.path === '/' ? '' : item.path}`,
    })),
  }
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
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: '종로구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
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
    description: '종로 종묘귀금속에 위치한 주얼리 도매 전문 매장입니다.',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: '종로구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
    openingHours: normalizedOpeningHours(settings),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: normalizedOpeningHours(settings)?.split(' ')[1]?.split('-')[0],
      closes: normalizedOpeningHours(settings)?.split(' ')[1]?.split('-')[1],
    },
    hasMap: validUrl(settings.naverMapUrl),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phonePrimary,
      contactType: 'customer service',
      availableLanguage: ['ko'],
    },
    areaServed: ['서울', '종로', '대한민국'],
    sameAs: socialLinks(settings),
    parentOrganization: {
      '@id': `${root}/#organization`,
    },
  }
}
