export type SiteSettings = {
  shopName: string
  phonePrimary: string
  phoneSecondary: string
  email: string
  address: string
  businessHours: string
  closedDay: string
  naverMapUrl: string
  instagramUrl: string
  facebookUrl: string
  businessName: string
  representativeName: string
  businessNumber: string
  homeHeroLine1: string
  homeHeroLine2: string
  homeHeroCta: string
  homeMenuCta: string
  homeMenuNote: string
  homeBenefit1Title: string
  homeBenefit1Description: string
  homeBenefit2Title: string
  homeBenefit2Description: string
  homeBenefit3Title: string
  homeBenefit3Description: string
  homeBenefit4Title: string
  homeBenefit4Description: string
  homeBrandKicker: string
  homeBrandTitle1: string
  homeBrandTitle2: string
  homeBrandDescription: string
  homeBrandCta: string
  homeCollectionKicker: string
  homeCollectionTitle: string
  homeCollectionNecklacesTitle: string
  homeCollectionNecklacesSubtitle: string
  homeCollectionEarringsTitle: string
  homeCollectionEarringsSubtitle: string
  homeCollectionRingsTitle: string
  homeCollectionRingsSubtitle: string
  homeCollectionBraceletsTitle: string
  homeCollectionBraceletsSubtitle: string
  homeRecommendedKicker: string
  homeRecommendedTitle: string
  homeSignatureKicker: string
  homeSignatureTitle1: string
  homeSignatureTitle2: string
  homeSignatureDescription: string
  homeSignatureCta: string
  homeConsultKicker: string
  homeConsultTitle1: string
  homeConsultTitle2: string
  homeConsultDescription: string
  homeConsultCta: string
  homeConsultFeature1Title: string
  homeConsultFeature1Description: string
  homeConsultFeature2Title: string
  homeConsultFeature2Description: string
  homeConsultFeature3Title: string
  homeConsultFeature3Description: string
  homeFooterNote: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  shopName: 'JU JEWELRY',
  phonePrimary: '02-744-6268',
  phoneSecondary: '',
  email: 'bok00ju@naver.com',
  address: '서울 종로구 종로 173, 143호',
  businessHours: '매일 10:30 - 18:30',
  closedDay: '매달 셋째 주 화요일',
  naverMapUrl: 'https://map.naver.com/p/search/서울 종로구 종로 173',
  instagramUrl: 'https://www.instagram.com/bogju80?igsh=YXA4bzNieDQxYjUx',
  facebookUrl: '',
  businessName: 'JU JEWELRY',
  representativeName: '',
  businessNumber: '206-17-48634',
  homeHeroLine1: '오래 간직할 수 있는 빛,',
  homeHeroLine2: 'Ju가 차분히 제안합니다',
  homeHeroCta: '컬렉션 보기',
  homeMenuCta: '상담 예약',
  homeMenuNote: '제품 비교와 선물 상담이 필요하시면 문의 페이지에서 편하게 남겨 주세요.',
  homeBenefit1Title: '정교한 세공',
  homeBenefit1Description: '착용감과 비율까지 살핀 섬세한 마감',
  homeBenefit2Title: '선물 포장',
  homeBenefit2Description: '받는 순간까지 고급스럽게 완성하는 패키지',
  homeBenefit3Title: '엄선된 소재',
  homeBenefit3Description: '14K/18K 골드와 선별된 스톤의 안정적인 품질',
  homeBenefit4Title: '맞춤 상담',
  homeBenefit4Description: '예산과 용도에 맞춰 차분하게 제안합니다',
  homeBrandKicker: 'Brand Story',
  homeBrandTitle1: '시간이 지나도',
  homeBrandTitle2: '자연스럽게 빛나는 주얼리',
  homeBrandDescription:
    'Ju는 과한 장식보다 균형과 착용감을 먼저 봅니다. 매일의 옷차림에도, 특별한 날에도 편안하게 어울리는 주얼리를 제안합니다.',
  homeBrandCta: '브랜드 이야기 보기',
  homeCollectionKicker: 'Collection',
  homeCollectionTitle: '카테고리별 컬렉션',
  homeCollectionNecklacesTitle: 'NECKLACES',
  homeCollectionNecklacesSubtitle: '목걸이',
  homeCollectionEarringsTitle: 'EARRINGS',
  homeCollectionEarringsSubtitle: '귀걸이',
  homeCollectionRingsTitle: 'RINGS',
  homeCollectionRingsSubtitle: '반지',
  homeCollectionBraceletsTitle: 'BRACELETS',
  homeCollectionBraceletsSubtitle: '팔찌',
  homeRecommendedKicker: 'Recommended',
  homeRecommendedTitle: 'Ju 추천 제품',
  homeSignatureKicker: 'Signature Collection',
  homeSignatureTitle1: '빛의 결을 담은',
  homeSignatureTitle2: '시그니처 컬렉션',
  homeSignatureDescription:
    '작지만 선명한 반짝임, 매일 손이 가는 편안한 비율. Ju가 오래 착용할 수 있는 기본을 세심하게 고릅니다.',
  homeSignatureCta: '시그니처 제품 보기',
  homeConsultKicker: 'Gift & Consultation',
  homeConsultTitle1: '마음을 전하는 순간도',
  homeConsultTitle2: '차분하게 준비해 드립니다',
  homeConsultDescription:
    '착용할 분의 취향, 예산, 필요한 날짜를 알려주시면 어울리는 제품과 포장까지 함께 안내해 드립니다.',
  homeConsultCta: '상담 예약하기',
  homeConsultFeature1Title: '선물 포장',
  homeConsultFeature1Description: '받는 순간까지 정돈된 패키지로 준비합니다.',
  homeConsultFeature2Title: '1:1 상담',
  homeConsultFeature2Description: '취향과 예산에 맞춰 부담 없이 비교해 드립니다.',
  homeConsultFeature3Title: '제품 확인',
  homeConsultFeature3Description: '소재와 스펙, 관리 방법까지 함께 안내합니다.',
  homeFooterNote: '오래 착용할 수 있는 빛을 Ju의 시선으로 제안합니다.',
}

export function normalizeSiteSettings(
  input: Record<string, string> | null | undefined
): SiteSettings {
  const source = input ?? {}

  return {
    shopName: source.shop_name || DEFAULT_SITE_SETTINGS.shopName,
    phonePrimary: source.phone_primary || DEFAULT_SITE_SETTINGS.phonePrimary,
    phoneSecondary: source.phone_secondary || DEFAULT_SITE_SETTINGS.phoneSecondary,
    email: source.email || DEFAULT_SITE_SETTINGS.email,
    address: source.address || DEFAULT_SITE_SETTINGS.address,
    businessHours: source.business_hours || DEFAULT_SITE_SETTINGS.businessHours,
    closedDay: source.closed_day || DEFAULT_SITE_SETTINGS.closedDay,
    naverMapUrl: source.naver_map_url || DEFAULT_SITE_SETTINGS.naverMapUrl,
    instagramUrl: source.instagram_url || DEFAULT_SITE_SETTINGS.instagramUrl,
    facebookUrl: source.facebook_url || DEFAULT_SITE_SETTINGS.facebookUrl,
    businessName: source.business_name || DEFAULT_SITE_SETTINGS.businessName,
    representativeName: source.representative_name || DEFAULT_SITE_SETTINGS.representativeName,
    businessNumber: source.business_number || DEFAULT_SITE_SETTINGS.businessNumber,
    homeHeroLine1: source.home_hero_line_1 || DEFAULT_SITE_SETTINGS.homeHeroLine1,
    homeHeroLine2: source.home_hero_line_2 || DEFAULT_SITE_SETTINGS.homeHeroLine2,
    homeHeroCta: source.home_hero_cta || DEFAULT_SITE_SETTINGS.homeHeroCta,
    homeMenuCta: source.home_menu_cta || DEFAULT_SITE_SETTINGS.homeMenuCta,
    homeMenuNote: source.home_menu_note || DEFAULT_SITE_SETTINGS.homeMenuNote,
    homeBenefit1Title: source.home_benefit_1_title || DEFAULT_SITE_SETTINGS.homeBenefit1Title,
    homeBenefit1Description:
      source.home_benefit_1_description || DEFAULT_SITE_SETTINGS.homeBenefit1Description,
    homeBenefit2Title: source.home_benefit_2_title || DEFAULT_SITE_SETTINGS.homeBenefit2Title,
    homeBenefit2Description:
      source.home_benefit_2_description || DEFAULT_SITE_SETTINGS.homeBenefit2Description,
    homeBenefit3Title: source.home_benefit_3_title || DEFAULT_SITE_SETTINGS.homeBenefit3Title,
    homeBenefit3Description:
      source.home_benefit_3_description || DEFAULT_SITE_SETTINGS.homeBenefit3Description,
    homeBenefit4Title: source.home_benefit_4_title || DEFAULT_SITE_SETTINGS.homeBenefit4Title,
    homeBenefit4Description:
      source.home_benefit_4_description || DEFAULT_SITE_SETTINGS.homeBenefit4Description,
    homeBrandKicker: source.home_brand_kicker || DEFAULT_SITE_SETTINGS.homeBrandKicker,
    homeBrandTitle1: source.home_brand_title_1 || DEFAULT_SITE_SETTINGS.homeBrandTitle1,
    homeBrandTitle2: source.home_brand_title_2 || DEFAULT_SITE_SETTINGS.homeBrandTitle2,
    homeBrandDescription: source.home_brand_description || DEFAULT_SITE_SETTINGS.homeBrandDescription,
    homeBrandCta: source.home_brand_cta || DEFAULT_SITE_SETTINGS.homeBrandCta,
    homeCollectionKicker:
      source.home_collection_kicker || DEFAULT_SITE_SETTINGS.homeCollectionKicker,
    homeCollectionTitle: source.home_collection_title || DEFAULT_SITE_SETTINGS.homeCollectionTitle,
    homeCollectionNecklacesTitle:
      source.home_collection_necklaces_title || DEFAULT_SITE_SETTINGS.homeCollectionNecklacesTitle,
    homeCollectionNecklacesSubtitle:
      source.home_collection_necklaces_subtitle ||
      DEFAULT_SITE_SETTINGS.homeCollectionNecklacesSubtitle,
    homeCollectionEarringsTitle:
      source.home_collection_earrings_title || DEFAULT_SITE_SETTINGS.homeCollectionEarringsTitle,
    homeCollectionEarringsSubtitle:
      source.home_collection_earrings_subtitle ||
      DEFAULT_SITE_SETTINGS.homeCollectionEarringsSubtitle,
    homeCollectionRingsTitle:
      source.home_collection_rings_title || DEFAULT_SITE_SETTINGS.homeCollectionRingsTitle,
    homeCollectionRingsSubtitle:
      source.home_collection_rings_subtitle || DEFAULT_SITE_SETTINGS.homeCollectionRingsSubtitle,
    homeCollectionBraceletsTitle:
      source.home_collection_bracelets_title || DEFAULT_SITE_SETTINGS.homeCollectionBraceletsTitle,
    homeCollectionBraceletsSubtitle:
      source.home_collection_bracelets_subtitle ||
      DEFAULT_SITE_SETTINGS.homeCollectionBraceletsSubtitle,
    homeRecommendedKicker:
      source.home_recommended_kicker || DEFAULT_SITE_SETTINGS.homeRecommendedKicker,
    homeRecommendedTitle: source.home_recommended_title || DEFAULT_SITE_SETTINGS.homeRecommendedTitle,
    homeSignatureKicker:
      source.home_signature_kicker || DEFAULT_SITE_SETTINGS.homeSignatureKicker,
    homeSignatureTitle1: source.home_signature_title_1 || DEFAULT_SITE_SETTINGS.homeSignatureTitle1,
    homeSignatureTitle2: source.home_signature_title_2 || DEFAULT_SITE_SETTINGS.homeSignatureTitle2,
    homeSignatureDescription:
      source.home_signature_description || DEFAULT_SITE_SETTINGS.homeSignatureDescription,
    homeSignatureCta: source.home_signature_cta || DEFAULT_SITE_SETTINGS.homeSignatureCta,
    homeConsultKicker: source.home_consult_kicker || DEFAULT_SITE_SETTINGS.homeConsultKicker,
    homeConsultTitle1: source.home_consult_title_1 || DEFAULT_SITE_SETTINGS.homeConsultTitle1,
    homeConsultTitle2: source.home_consult_title_2 || DEFAULT_SITE_SETTINGS.homeConsultTitle2,
    homeConsultDescription:
      source.home_consult_description || DEFAULT_SITE_SETTINGS.homeConsultDescription,
    homeConsultCta: source.home_consult_cta || DEFAULT_SITE_SETTINGS.homeConsultCta,
    homeConsultFeature1Title:
      source.home_consult_feature_1_title || DEFAULT_SITE_SETTINGS.homeConsultFeature1Title,
    homeConsultFeature1Description:
      source.home_consult_feature_1_description ||
      DEFAULT_SITE_SETTINGS.homeConsultFeature1Description,
    homeConsultFeature2Title:
      source.home_consult_feature_2_title || DEFAULT_SITE_SETTINGS.homeConsultFeature2Title,
    homeConsultFeature2Description:
      source.home_consult_feature_2_description ||
      DEFAULT_SITE_SETTINGS.homeConsultFeature2Description,
    homeConsultFeature3Title:
      source.home_consult_feature_3_title || DEFAULT_SITE_SETTINGS.homeConsultFeature3Title,
    homeConsultFeature3Description:
      source.home_consult_feature_3_description ||
      DEFAULT_SITE_SETTINGS.homeConsultFeature3Description,
    homeFooterNote: source.home_footer_note || DEFAULT_SITE_SETTINGS.homeFooterNote,
  }
}

export function getContactLines(settings: SiteSettings): string[] {
  return [settings.phonePrimary, settings.phoneSecondary, settings.email].filter(Boolean)
}
