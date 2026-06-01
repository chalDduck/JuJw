
import type { MetadataRoute } from 'next'
import { getCategories, getNotices, getProducts } from '@/lib/db'
import { getSiteUrl } from '@/lib/env'

const CONTENT_LAST_MODIFIED = new Date('2026-06-01T00:00:00.000+09:00')

export const dynamic = 'force-dynamic'

function safeDate(value: string | Date | null | undefined): Date {
  const date = value ? new Date(value) : CONTENT_LAST_MODIFIED
  return Number.isNaN(date.getTime()) ? CONTENT_LAST_MODIFIED : date
}

function latestDate(values: Array<string | Date | null | undefined>): Date {
  let latest = CONTENT_LAST_MODIFIED

  for (const value of values) {
    const date = safeDate(value)
    if (date > latest) {
      latest = date
    }
  }

  return latest
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl().replace(/\/$/, '')

  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/trade',
    '/location',
    '/contact',
    '/faq',
    '/notices',
    '/privacy',
    '/terms',
    '/guide',
    '/jongno-jewelry',
    '/wholesale-wedding-ring',
    '/diamond-wholesale',
  ]

  const categories = await getCategories()
  const products = await getProducts({ published: true })
  const notices = await getNotices({ publishedOnly: true })
  const latestProductDate = latestDate(products.map((product) => product.updatedAt))
  const latestNoticeDate = latestDate(notices.map((notice) => notice.updatedAt))

  const noticeRoutes = notices.map((notice) => ({
    url: `${siteUrl}/notices/${notice.id}`,
    lastModified: safeDate(notice.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const categoryRoutes = categories
    .map((category) => {
      const categoryProducts = products.filter((product) => product.categorySlug === category.slug)

      if (categoryProducts.length === 0) {
        return null
      }

      return {
        url: `${siteUrl}/products/${category.slug}`,
        lastModified: latestDate(categoryProducts.map((product) => product.updatedAt)),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })
    .filter((route): route is NonNullable<typeof route> => Boolean(route))

  const productRoutes = products
    .filter((product) => product.categorySlug)
    .map((product) => ({
      url: `${siteUrl}/products/${product.categorySlug}/${product.slug}`,
      lastModified: safeDate(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [
    ...staticRoutes.map((path) => {
      const lastModified =
        path === '/products'
          ? latestProductDate
          : path === '/notices'
            ? latestNoticeDate
            : CONTENT_LAST_MODIFIED

      return {
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1 : 0.6,
      }
    }),
    ...categoryRoutes,
    ...productRoutes,
    ...noticeRoutes,
  ]
}
