import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// 전체 목록은 이제 컬렉션 페이지(/products)에 통합되어 별도 단계 없이 바로 둘러볼 수 있습니다.
// 기존 링크·북마크 유지를 위해 컬렉션 페이지로 넘겨줍니다.
export default function ProductsAllPage() {
  redirect('/products')
}
