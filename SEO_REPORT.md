# JU JEWELRY · SEO / 검색노출 전수분석 리포트

> 작성일: 2026-05-31 · 대상: 운영 사이트 https://jujw.fnvlzl95.workers.dev (커밋 기준 `main`)
> 분석 범위: 메타데이터·canonical·구조화데이터(JSON-LD)·robots·sitemap·검색엔진 등록/인증·렌더링(SSR)·도메인·이미지/성능 — 라이브 응답까지 실측

---

## 0. 한 줄 결론

> **"SEO 기초 골격(SSR·sitemap·robots·일부 구조화데이터)은 갖췄지만, 정작 '검색 노출'을 결정하는 4가지 핵심 — ① canonical 오설정, ② 검색엔진 등록·인증 부재(특히 네이버), ③ 지역 매장 구조화데이터(LocalBusiness) 부재, ④ workers.dev 임시 도메인 — 이 비어 있어 현재 상태로는 검색에 제대로 노출되기 어렵습니다."**

| 영역 | 상태 |
|------|:----:|
| 크롤링 가능성(SSR/robots/sitemap) | 🟢 양호 |
| 메타데이터(title/description/OG) | 🟡 부분 |
| **canonical(정규화)** | 🔴 **오설정(전 페이지가 홈을 가리킴)** |
| **검색엔진 등록·인증(Google/네이버)** | 🔴 **없음** |
| **지역/제품 구조화데이터** | 🟡 제품·FAQ만, **매장(LocalBusiness) 없음** |
| 도메인 | 🔴 workers.dev (임시) |
| 성능(이미지 최적화) | 🟡 개선 여지 |

**종합 점수: 약 45 / 100** — 기술 토대는 있으나 노출 핵심이 미완.

---

## 1. 잘 되어 있는 것 (강점) ✅

- **서버 렌더링(SSR)**: 홈·제품·공지·FAQ·문의 등 모든 공개 페이지가 서버에서 HTML로 렌더 → 크롤러가 본문을 읽을 수 있음. (이전에 클라이언트 패칭이던 홈/문의/FAQ도 SSR로 전환 완료)
- **robots.txt**: 정상 동작. `/admin` 차단, sitemap 위치 명시, host 지정 — 라이브 확인됨.
  - `Disallow: /admin`, `Sitemap: …/sitemap.xml` ✓
- **sitemap.xml**: 정적 페이지 + 카테고리 + 제품 + 공지까지 동적 생성, 우선순위/변경빈도 포함 — 라이브에서 올바른 도메인으로 출력됨 ([sitemap.ts](src/app/sitemap.ts)).
- **구조화 데이터 일부**: 제품 상세(`Product`+`BreadcrumbList`), 제품 카테고리(`BreadcrumbList`), FAQ(`FAQPage`) JSON-LD 적용 ([JsonLd.tsx](src/components/seo/JsonLd.tsx)).
- **기본 메타데이터**: 루트 [layout.tsx](src/app/layout.tsx)에 title 템플릿, description, keywords, Open Graph, Twitter Card, `lang="ko"`, `locale: ko_KR` 설정.
- **페이지별 메타데이터**: 16개 페이지가 개별 title/description 보유.

---

## 2. 치명적 문제 (P0) — 지금 검색 노출을 막는 요인

### 🔴 P0-1. canonical이 전 페이지에서 "홈"을 가리킴 (가장 심각)

루트 [layout.tsx:48](src/app/layout.tsx) 에 `alternates: { canonical: '/' }` 가 있는데, **자체 canonical을 지정하지 않은 페이지들이 이 값을 그대로 상속**받습니다. 그 결과 서로 다른 페이지가 모두 홈을 정식 주소로 선언합니다.

**라이브 실측 (오늘 확인):**
```
/about         canonical → https://jujw.fnvlzl95.workers.dev      ❌ (홈)
/trade         canonical → https://jujw.fnvlzl95.workers.dev      ❌ (홈)
/products      canonical → https://jujw.fnvlzl95.workers.dev      ❌ (홈)
/jongno-jewelry canonical → https://jujw.fnvlzl95.workers.dev     ❌ (홈)
```

**영향:** 검색엔진이 about·trade·location·products·랜딩페이지(4종)를 **"홈의 중복"으로 판단해 색인에서 제외**합니다. 특히 키워드 노출용으로 만든 `/jongno-jewelry`, `/diamond-wholesale`, `/wholesale-wedding-ring`, `/guide` 가 무력화됩니다.

**canonical 누락 페이지:** 홈(정상), about, trade, location, products, guide, jongno-jewelry, wholesale-wedding-ring, diamond-wholesale
**canonical 정상 페이지:** contact, faq, terms, privacy, notices, notices/[id], products/all, products/[category], products/[category]/[slug]

**조치:** 루트 layout에서 `alternates.canonical` 제거 + 각 페이지에 자기 경로 canonical 부여(또는 홈 전용 metadata로 이동).

---

### 🔴 P0-2. 검색엔진 등록·인증이 전혀 없음 (특히 네이버)

사이트를 만들어도 **검색엔진에 "등록"하고 소유권을 "인증"**하지 않으면 노출이 늦거나 안 됩니다. 현재 코드/사이트에 인증 수단이 하나도 없습니다.

- ❌ **Google Search Console** 소유권 인증 메타태그 없음 (`google-site-verification`)
- ❌ **네이버 서치어드바이저** 인증 메타태그 없음 (`naver-site-verification`)
  - 🇰🇷 한국 주얼리 도매 = **검색 트래픽 대부분이 네이버**. 네이버 등록·인증·사이트맵 제출이 사실상 가장 중요한데 전무합니다.
- ❌ 다음(Daum) 등록 없음
- `metadata.verification` 필드 미사용

**조치:** Google Search Console + 네이버 서치어드바이저에 사이트 등록 → 인증 메타태그를 layout에 추가 → sitemap 제출. (5장 체크리스트 참고)

---

### 🔴 P0-3. workers.dev 임시 도메인

현재 주소 `jujw.fnvlzl95.workers.dev` 는 Cloudflare 기본 서브도메인입니다.
- `*.workers.dev` / `*.pages.dev` 는 검색엔진에서 **신뢰도·노출이 낮고, 브랜드 검색에도 불리**합니다.
- 명함/홍보에 쓰기도 어렵고, 추후 도메인 이전 시 그동안 쌓은 색인이 리셋됩니다.

**조치:** `jujewelry.co.kr` 같은 **커스텀 도메인 연결**(Cloudflare에서 간단). 이후 `SITE_URL`/`wrangler.jsonc` vars를 새 도메인으로 교체.

---

## 3. 중요 개선 (P1)

### 🟠 P1-1. 매장 구조화데이터(LocalBusiness/JewelryStore) 부재
지역 오프라인 매장(종로)인데 **`LocalBusiness`(또는 `JewelryStore`) 스키마가 없습니다.** 이건 구글 지역검색·지도·지식패널 노출의 핵심입니다.
- 권장: 상호, 주소, 좌표, 전화, 영업시간, 가격대, 지도 URL을 담은 `JewelryStore` JSON-LD를 홈/오시는 길에 추가. (관리자 설정값 재사용 가능)
- 함께 `Organization` + `WebSite` 스키마(브랜드/사이트링크)도 권장.

### 🟠 P1-2. 홈(`/`)과 제품목록(`/products`) 페이지에 개별 메타데이터 없음
- `src/app/page.tsx`(홈), `src/app/products/page.tsx` 에 `metadata` export가 없어 **루트 기본값을 그대로 사용** → `/products` 의 title/description이 홈과 동일(중복).
- 조치: 두 페이지에 전용 title/description/canonical 추가. (특히 `/products` = "주얼리 도매 컬렉션" 류 키워드)

### 🟠 P1-3. 홈 H1이 "Ju" 한 글자
[HomeView.tsx:293](src/components/home/HomeView.tsx) 의 `<h1>` 이 장식용 "Ju" 입니다. 검색엔진엔 의미가 약합니다.
- 조치: 시각적 디자인은 유지하되, 스크린리더/SEO용 서술적 제목(예: "종로 귀금속 도매 JU JEWELRY")을 `sr-only` 등으로 병행하거나 H1 텍스트를 보강.

### 🟠 P1-4. OG 이미지·파비콘 미흡
- 모든 페이지 OG/트위터 이미지가 공용 `/img/hero/hero.png` 하나. (1200×630 선언이지만 실제 비율 확인 필요)
- **전용 파비콘(.ico)·앱 아이콘·`manifest.webmanifest` 파일이 없음** — `icons`가 전부 `hero.png`를 가리킴(브라우저 탭/북마크 품질 저하).
- 조치: 정사각 파비콘 세트 + 1200×630 전용 OG 이미지 + `app/icon.png`·`app/apple-icon.png`·`manifest` 추가. 페이지별(제품 상세=제품 이미지) OG도 권장.

### 🟠 P1-5. metadataBase 기본값이 옛 도메인
[layout.tsx:14](src/app/layout.tsx) 의 fallback이 `https://jujw.pages.dev` (현재 미사용 도메인). 런타임엔 `SITE_URL`(workers.dev)이 들어와 정상 동작하지만, 환경변수 누락 시 잘못된 절대 URL이 생성됩니다.
- 조치: fallback을 실제 운영 도메인으로 교체.

---

## 4. 권장 개선 (P2)

- **이미지 최적화 꺼짐**: [next.config.mjs](next.config.mjs) `images.unoptimized: true` + `<img>` 직접 사용. 대형 PNG 히어로가 그대로 로드 → LCP/Core Web Vitals 저하(랭킹 요소). WebP/AVIF 변환·사이즈 최적화 권장.
- **죽은 코드/잘못된 기본 도메인**: [metadata.ts](src/lib/metadata.ts) `buildPageMetadata` 는 어디서도 사용되지 않으며 기본 도메인이 `jujewelry.co.kr` 로 layout과 불일치. 제거 또는 단일 소스로 통합 권장.
- **robots 보강**: `/api` 도 `Disallow` 추가 검토(현재 `/admin`만). sitemap에 noindex가 필요한 약관/개인정보는 우선순위 낮춤 정도로 충분.
- **sitemap lastmod**: 홈/카테고리/정적 경로가 항상 `now()` 로 찍혀 "매 요청마다 변경"처럼 보임 → 실제 변경 시각 기준이 더 정확.
- **JSON-LD 확장**: 제품에 `brand`, `image` 절대경로, 가격 정책(현재 price '0') 정비. 빵부스러기(Breadcrumb)를 about/trade 등에도 확대.

---

## 5. 검색 등록·노출 실행 체크리스트 (가장 중요)

> 코드 수정과 별개로 **사람이 직접** 해야 하는 등록 작업입니다.

### A. 도메인 (선행 권장)
- [ ] 커스텀 도메인(`jujewelry.co.kr` 등) 구입 → Cloudflare에 연결 → `SITE_URL` 교체

### B. 구글
- [ ] [Google Search Console](https://search.google.com/search-console) 속성 등록
- [ ] 소유권 인증(HTML 태그 방식 → layout에 `verification.google` 추가)
- [ ] `sitemap.xml` 제출
- [ ] [Google 비즈니스 프로필](https://business.google.com) 등록(지도/지역검색)

### C. 네이버 (한국 최우선) 🇰🇷
- [ ] [네이버 서치어드바이저](https://searchadvisor.naver.com) 사이트 등록
- [ ] 소유 확인(HTML 태그 → `naver-site-verification` 메타 추가)
- [ ] 사이트맵·RSS 제출, 수집 요청
- [ ] **네이버 스마트플레이스**(지역 업체 등록) → 네이버 지도/플레이스 노출
- [ ] 네이버 블로그/지식iN 등 연계(브랜드 검색 강화)

### D. 다음/기타
- [ ] [다음 검색등록](https://register.search.daum.net) 신청

---

## 6. 우선순위 액션 요약

| 우선순위 | 작업 | 성격 | 효과 |
|:---:|------|:---:|------|
| **P0** | canonical 정상화(layout 제거 + 페이지별 부여) | 코드 | 페이지들이 색인에서 살아남음 |
| **P0** | 네이버 서치어드바이저 + 구글 SC 등록·인증 | 등록+코드 | 검색 노출 시작 |
| **P0** | 커스텀 도메인 연결 | 인프라 | 신뢰도/브랜드 노출 |
| **P1** | LocalBusiness(JewelryStore) 구조화데이터 | 코드 | 지역검색/지도/지식패널 |
| **P1** | 홈·/products 메타데이터 + 홈 H1 보강 | 코드 | 중복 제거, 키워드 타겟 |
| **P1** | 파비콘/매니페스트/OG 이미지 정비 | 코드+에셋 | 브랜드 표시 품질 |
| **P2** | 이미지 최적화(WebP), JSON-LD 확장, robots/sitemap 정비 | 코드 | 성능/정밀도 |

---

## 7. 결론

크롤러가 읽을 수 있는 **기술적 토대(SSR·robots·sitemap·일부 스키마)는 이미 마련**돼 있어 출발점은 좋습니다. 다만 지금은 **검색 노출의 4대 핵심(① canonical, ② 검색엔진 등록·인증, ③ 지역 매장 스키마, ④ 도메인)** 이 비어 있어, 사이트가 떠 있어도 검색 결과에 제대로 나오지 않을 가능성이 높습니다.

**가장 먼저**: (1) canonical 코드 수정(즉시, 제가 가능) → (2) 커스텀 도메인 연결 → (3) 네이버·구글 등록/인증 순으로 진행하면, 코드 한 번 손보고 등록만 하면 빠르게 노출 기반이 갖춰집니다.

> 위 P0/P1 **코드 수정(canonical·LocalBusiness·메타데이터·파비콘·verification 태그 자리)** 은 제가 바로 반영해 드릴 수 있습니다. 도메인 구입과 검색엔진 계정 등록만 사장님이 진행하시면 됩니다.

---

*본 리포트는 정적 코드 분석 + 라이브 응답 실측 기반입니다. 실제 색인 현황은 도메인/등록 완료 후 Search Console·서치어드바이저에서 추적해야 합니다.*
