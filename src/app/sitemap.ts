
import type { MetadataRoute } from 'next'
import { getCategories, getNotices, getProducts } from '@/lib/db'
import { getSiteUrl } from '@/lib/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl().replace(/\/$/, '')

  const staticRoutes = [
    '',
    '/about',
    '/products',
    '/products/all',
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

  const noticeRoutes = notices.map((notice) => ({
    url: `${siteUrl}/notices/${notice.id}`,
    lastModified: new Date(notice.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/products/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const productRoutes = products
    .filter((product) => product.categorySlug)
    .map((product) => ({
      url: `${siteUrl}/products/${product.categorySlug}/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.6,
    })),
    ...categoryRoutes,
    ...productRoutes,
    ...noticeRoutes,
  ]
}
