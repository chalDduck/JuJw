import type { Metadata } from 'next'
import { getPublicSettings } from '@/lib/db'
import { DEFAULT_FAQ_CATEGORIES, parseFaqItems } from '@/lib/faq'
import JsonLd from '@/components/seo/JsonLd'
import FaqView from '@/components/faq/FaqView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description:
    '주문/결제, 제품 품질, 배송, A/S 등 Ju Jewelry 도매 거래에 대해 자주 묻는 질문을 정리했습니다.',
  alternates: { canonical: '/faq' },
}

export default async function FaqPage() {
  const settings = await getPublicSettings()
  const faqs = parseFaqItems(settings.faq_items)

  return (
    <>
      <JsonLd
        id="faq-jsonld"
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <FaqView faqs={faqs} categories={DEFAULT_FAQ_CATEGORIES} />
    </>
  )
}
