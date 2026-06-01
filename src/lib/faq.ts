export type FaqCategory = {
  id: string
  name: string
  description: string
}

export type FaqItem = {
  id: number
  category: string
  question: string
  answer: string
}

export const DEFAULT_FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'all', name: '전체', description: '주문부터 A/S까지 전체 질문을 빠르게 확인할 수 있습니다.' },
  { id: 'order', name: '주문/결제', description: '거래 방식과 결제 조건 안내입니다.' },
  { id: 'product', name: '제품', description: '품질 보증과 맞춤 제작, 카탈로그 관련 내용입니다.' },
  { id: 'delivery', name: '배송', description: '출고 일정과 수령 방식, 배송 기준을 확인할 수 있습니다.' },
  { id: 'as', name: 'A/S', description: '교환과 반품, 사후 점검 절차를 정리했습니다.' },
]

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    category: 'order',
    question: '최소 주문 수량이 있나요?',
    answer:
      '최소 주문 수량은 별도로 정해져 있지 않습니다. 소량 주문도 가능하며, 수량 및 금액은 상담을 통해 협의해 드립니다. 첫 거래 시에도 부담 없이 문의해 주세요.',
  },
  {
    id: 2,
    category: 'order',
    question: '견적은 어떻게 받을 수 있나요?',
    answer:
      '품목, 수량, 납기, 예산 범위를 남겨 주시면 상담 후 조건에 맞춰 견적을 안내합니다. 필요한 경우 제품군을 먼저 정리해 드립니다.',
  },
  {
    id: 3,
    category: 'order',
    question: '결제는 어떤 방식으로 가능한가요?',
    answer:
      '현금, 카드, 계좌이체 모두 가능합니다. 대량 주문 시 결제 조건은 협의 가능하며, 자세한 내용은 상담 시 안내드립니다.',
  },
  {
    id: 4,
    category: 'product',
    question: '제품 품질 보증은 어떻게 되나요?',
    answer:
      '모든 다이아몬드는 GIA 인증서를 제공합니다. 귀금속 함량 및 제품 스펙은 정확하게 표기되며, 품질에 대해 확실히 보증합니다.',
  },
  {
    id: 5,
    category: 'product',
    question: '맞춤 제작이 가능한가요?',
    answer:
      '네, 고객의 요청에 따른 맞춤 제작이 가능합니다. 원하시는 디자인, 소재, 사이즈 등을 말씀해 주시면 상담 후 제작 진행해 드립니다. 제작 기간은 디자인에 따라 7-14일 정도 소요됩니다.',
  },
  {
    id: 6,
    category: 'product',
    question: '카탈로그를 받아볼 수 있나요?',
    answer:
      '네, 상담 요청 시 카탈로그 요청을 선택해 주시면 이메일 또는 우편으로 보내드립니다. 더 다양한 제품을 확인하실 수 있습니다.',
  },
  {
    id: 7,
    category: 'delivery',
    question: '배송은 얼마나 걸리나요?',
    answer:
      '재고 보유 제품은 당일 또는 익일 출고됩니다. 주문 제작 제품은 디자인에 따라 7-14일 정도 소요됩니다. 배송은 안전 포장 후 택배로 발송되며, 종로 매장에서 직접 수령도 가능합니다.',
  },
  {
    id: 8,
    category: 'delivery',
    question: '배송비는 얼마인가요?',
    answer: '배송비는 주문 금액에 따라 달라질 수 있습니다. 자세한 내용은 상담 시 안내드립니다.',
  },
  {
    id: 9,
    category: 'as',
    question: '교환/반품이 가능한가요?',
    answer:
      '수령 직후 제품 상태를 확인해 주세요. 이상 여부와 주문 방식에 따라 교환 가능 범위를 안내하며, 맞춤 제작 제품은 별도 확인이 필요합니다.',
  },
  {
    id: 10,
    category: 'as',
    question: 'A/S는 어떻게 받나요?',
    answer:
      '구매하신 제품의 무상 점검 서비스를 제공합니다. 수리가 필요한 경우 합리적인 비용으로 진행해 드립니다. 매장 방문 또는 택배로 A/S 접수가 가능합니다.',
  },
]

export function parseFaqItems(value: string | null | undefined): FaqItem[] {
  if (!value) return DEFAULT_FAQS

  try {
    const parsed = JSON.parse(value) as Partial<FaqItem>[]
    if (!Array.isArray(parsed)) return DEFAULT_FAQS

    const validItems = parsed
      .map((item, index) => ({
        id: Number(item.id || index + 1),
        category: String(item.category || 'order'),
        question: String(item.question || '').trim(),
        answer: String(item.answer || '').trim(),
      }))
      .filter((item) => item.question && item.answer)

    return validItems.length > 0 ? validItems : DEFAULT_FAQS
  } catch {
    return DEFAULT_FAQS
  }
}
