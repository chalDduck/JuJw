import type { Product } from '@/lib/models'

export const GENERIC_PRODUCT_PLACEHOLDER = '/img/hero/hero.png'

export const productFallbacks: Record<string, string[]> = {
  rings: [GENERIC_PRODUCT_PLACEHOLDER],
  necklaces: [GENERIC_PRODUCT_PLACEHOLDER],
  earrings: [GENERIC_PRODUCT_PLACEHOLDER],
  bracelets: [GENERIC_PRODUCT_PLACEHOLDER],
  accessories: [GENERIC_PRODUCT_PLACEHOLDER],
}

export const defaultProductFallbacks = [
  GENERIC_PRODUCT_PLACEHOLDER,
]

export function resolveProductHref(product: Product) {
  return product.categorySlug ? `/products/${product.categorySlug}/${product.slug}` : '/contact'
}

export function trimText(text: string | null | undefined, fallback: string, limit: number) {
  const source = text?.trim() || fallback
  return source.length > limit ? `${source.slice(0, limit).trim()}...` : source
}

export function resolveProductImage(product: Product, index: number) {
  if (
    product.imageUrl &&
    product.imageUrl !== GENERIC_PRODUCT_PLACEHOLDER &&
    !product.imageUrl.startsWith('products/')
  ) {
    return product.imageUrl
  }

  const candidates = product.categorySlug
    ? productFallbacks[product.categorySlug] ?? defaultProductFallbacks
    : defaultProductFallbacks

  return candidates[index % candidates.length]
}
