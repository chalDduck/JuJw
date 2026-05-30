import { getProducts, getPublicSettings } from '@/lib/db'
import { normalizeSiteSettings } from '@/lib/site-settings'
import HomeView, { type HomeProduct } from '@/components/home/HomeView'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [settingsMap, featured] = await Promise.all([
    getPublicSettings(),
    getProducts({ featured: true, published: true, limit: 6 }),
  ])

  let products = featured
  if (products.length === 0) {
    products = await getProducts({ published: true, limit: 6 })
  }

  const settings = normalizeSiteSettings(settingsMap)
  const featuredProducts: HomeProduct[] = products.map((product) => ({
    id: product.id,
    categoryName: product.categoryName,
    categorySlug: product.categorySlug,
    imageUrl: product.imageUrl,
    name: product.name,
    slug: product.slug,
    spec: product.spec,
  }))

  return <HomeView settings={settings} featuredProducts={featuredProducts} />
}
