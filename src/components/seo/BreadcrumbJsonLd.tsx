import JsonLd from '@/components/seo/JsonLd'
import { buildBreadcrumbJsonLd } from '@/lib/structured-data'

type BreadcrumbJsonLdProps = {
  id?: string
  items: Array<{ name: string; path: string }>
}

export default function BreadcrumbJsonLd({
  id = 'breadcrumb-jsonld',
  items,
}: BreadcrumbJsonLdProps) {
  return <JsonLd id={id} data={buildBreadcrumbJsonLd(items)} />
}
