# JU JEWELRY 프로젝트 종합 분석 리포트

> 작성일: 2026-05-31 · 대상 브랜치: `main` (최신 커밋 `74c4d0e`)
> 분석 범위: 소스 전체(`src/`), 설정/배포 구성, 데이터 계층, 디자인 시스템, SEO/보안

---

## 0. 한 줄 요약

> **"공개 사이트의 UI 완성도는 상당히 높지만, 내부에 '구버전 / 신버전' 두 세대의 코드가 섞여 있고, 배포 파이프라인이 두 갈래(next-on-pages vs OpenNext)로 충돌하고 있어 '프로덕션 배포 직전 정리'가 가장 시급한 단계다."**

- 프론트엔드(스토어프론트) 외관: **약 85% 완성** — 에디토리얼 럭셔리 톤, 반응형, 이미지 에셋까지 갖춤
- 백엔드/관리자 기능: **약 70% 완성** — CRUD·인증·업로드·문의 흐름은 동작, 단 실DB 연동/영속성 검증 미완
- 배포/인프라 정합성: **약 40%** — 어댑터·설정 파일·스키마가 이중으로 존재해 정리 필요
- 코드 정합성/위생: **약 50%** — 죽은 코드와 중복 데이터 계층이 다수 잔존

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 성격 | 종로 종묘귀금속 소재 B2B/B2C 주얼리 도매 브랜드 사이트 |
| 프레임워크 | Next.js 14 (App Router) |
| 스타일 | Tailwind CSS 3.4, Quiet Luxury / 에디토리얼 톤 (브라운·골드·아이보리) |
| 아이콘/폰트 | lucide-react, Pretendard(본문) + Cormorant Garamond(디스플레이) + Noto Serif KR |
| 데이터 | Cloudflare D1(SQLite) + R2(이미지), 미바인딩 시 인메모리 fallback |
| 인증 | 자체 구현 JWT(HMAC-SHA256) + PBKDF2 비밀번호 해시 |
| 배포 목표 | Cloudflare Pages (GitHub Actions 자동 배포) |

핵심 문서: [SPECIFICATION.md](SPECIFICATION.md), [README.md](README.md), [db/SETUP.md](db/SETUP.md)

---

## 2. 진행 상황 (완료된 것)

SPECIFICATION.md의 5단계 계획 대비 실제 구현 상태입니다.

### ✅ Phase 1 — 기초 (완료)
- Next.js + Tailwind + 디자인 토큰 ([tailwind.config.js](tailwind.config.js))
- 공통 레이아웃 ([src/app/layout.tsx](src/app/layout.tsx)), 헤더/푸터
- 홈페이지 ([src/app/page.tsx](src/app/page.tsx)) — 히어로/혜택/브랜드/컬렉션/추천/시그니처/상담 7개 섹션

### ✅ Phase 2 — 페이지 (거의 완료)
- 브랜드 소개 `/about`, 제품 `/products` (+ `/all`, `/[category]`, `/[category]/[slug]`)
- 거래 안내 `/trade`, 오시는 길 `/location`, 문의 `/contact`, FAQ `/faq`
- 약관/개인정보 `/terms`, `/privacy`, 에러/404 페이지
- SEO 랜딩 4종: `/diamond-wholesale`, `/jongno-jewelry`, `/wholesale-wedding-ring`, `/guide`

### ✅ Phase 3 — 백엔드 (대부분 완료)
- 공개 API: `/api/categories`, `/api/products`, `/api/settings`, `/api/notices`, `/api/inquiries`
- 데이터 접근 계층 [src/lib/db.ts](src/lib/db.ts) — D1 우선, 미바인딩 시 인메모리
- D1 스키마 [db/schema.sql](db/schema.sql) (categories/products/product_images/inquiries/settings/admins/notices)
- 문의 폼 연동 + 레이트리밋 + 허니팟 스팸 차단

### ✅ Phase 4 — 관리자 (대부분 완료)
- 로그인/세션 미들웨어 ([src/middleware.ts](src/middleware.ts)), JWT 쿠키
- 제품 CRUD + 이미지 업로드(R2) ([src/app/admin/products/page.tsx](src/app/admin/products/page.tsx))
- 문의 상태 관리, 사이트 설정/홈 콘텐츠/FAQ 편집 (`/admin/inquiries`, `/admin/settings`, `/admin/home`, `/admin/faq`)
- 대시보드 요약 ([src/app/admin/page.tsx](src/app/admin/page.tsx))

### 🟡 Phase 5 — 마무리 (부분 완료)
- SEO: `sitemap.ts`, `robots.ts`, JSON-LD ([src/components/seo/JsonLd.tsx](src/components/seo/JsonLd.tsx)) ✅
- 성능 최적화 / 도메인 연결 / 실DB·R2 바인딩 검증: ⛔ 미완
- 배포 파이프라인 정합성: ⛔ 미완 (3장 참고)

---

## 3. 핵심 문제점 (우선 해결 대상)

### 🔴 P0-1. 데이터 계층이 두 세대로 중복 존재

같은 일을 하는 코드가 **신/구 두 벌** 공존합니다.

| 구분 | 신버전 (실사용) | 구버전 (사실상 미사용) |
|------|----------------|----------------------|
| 데이터 함수 | [src/lib/db.ts](src/lib/db.ts) | [src/lib/site-data.ts](src/lib/site-data.ts) |
| 타입 | [src/lib/models.ts](src/lib/models.ts) | [src/types/site.ts](src/types/site.ts) |
| 설정 모델 | [src/lib/site-settings.ts](src/lib/site-settings.ts) (snake_case key-value) | `SiteSettings`(camelCase 고정 필드) |
| 저장소 | `globalThis.__jujwStore` (인메모리) | `data/local-db.json` (파일) |
| 바인딩 접근 | `@cloudflare/next-on-pages`의 `getRequestContext()` | `cloudflare:workers` 동적 import |
| 스키마 | [db/schema.sql](db/schema.sql) (slug·is_published·product_images·notices 포함) | [migrations/0001_initial.sql](migrations/0001_initial.sql), [migrations/0002_seed.sql](migrations/0002_seed.sql) |

**영향**
- `ProductInput` 타입이 두 곳에서 서로 다르게 정의됨 (신: `categoryId`+`slug`, 구: `categorySlug`+`imageUrl`).
- 단 하나 남은 구버전 연결고리: **`/api/products/featured`** ([route.ts](src/app/api/products/featured/route.ts))가 아직 `site-data.ts`를 사용 → 사이트의 나머지(인메모리/D1)와 **다른 데이터 소스**(local-db.json)를 바라봄. 더구나 이 라우트는 `export const runtime = 'edge'`가 없고 `site-data.ts`가 `node:fs`/`process.cwd()`를 사용하므로 **Cloudflare 엣지에서 동작 불가**(빌드/런타임 실패 위험). 다행히 홈 화면은 이 라우트 대신 `/api/products?featured=true`를 호출하므로 현재 화면에는 영향 없음.

**조치**: 구버전 일괄 제거 — `site-data.ts`, `types/site.ts`, `cloudflare.ts`, `validation.ts`, `data/local-db.json`, `migrations/` 중 미사용분, `/api/products/featured`. (검증 결과 [src/lib/validation.ts](src/lib/validation.ts)의 `validateProductPayload/Settings/Inquiry`는 **어디서도 호출되지 않는 죽은 코드**입니다.)

---

### 🔴 P0-2. 배포/빌드 어댑터가 두 갈래로 충돌

Cloudflare 배포 방식이 **두 개**가 섞여 있습니다.

| 신호 | 가리키는 방식 |
|------|--------------|
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) → `npm run cf:build` → `@cloudflare/next-on-pages` → `pages deploy .vercel/output/static` | **next-on-pages (Pages)** |
| [package.json](package.json) devDeps `@opennextjs/cloudflare`, [open-next.config.ts](open-next.config.ts), [next.config.mjs](next.config.mjs)의 `initOpenNextCloudflareForDev()`, `.open-next/` 산출물, [wrangler.jsonc](wrangler.jsonc)(`main: .open-next/worker.js`) | **OpenNext (Workers)** |

추가로 설정 파일도 **이중**입니다.
- `next.config.js`(CommonJS) **와** `next.config.mjs`(OpenNext init) 공존 → Next.js는 `next.config.js`를 우선 사용하므로 **`.mjs`의 OpenNext 초기화는 실행되지 않을 가능성이 큼**. 결과적으로 로컬 `next dev`에서 D1/R2 바인딩이 주입되지 않아 항상 인메모리로 동작.
- `wrangler.toml`(바인딩 없음, SITE_URL만) **와** `wrangler.jsonc`(D1/R2/캐시 버킷 풀세팅) 공존.

**조치**: 배포 방식을 **하나로 확정**하고 반대편 잔재 제거.
- next-on-pages 유지 시 → OpenNext 관련(`open-next.config.ts`, `next.config.mjs`, `wrangler.jsonc`, `@opennextjs/cloudflare`, `.open-next/`) 제거.
- OpenNext 유지 시 → deploy.yml/`cf:build`를 OpenNext 기준으로 교체하고 `next.config.js`/`wrangler.toml` 정리.
- ⚠️ `@cloudflare/next-on-pages`는 사실상 유지보수 종료(deprecated) 방향이라 신규는 **OpenNext 권장**.

---

### 🟠 P1-1. 주요 페이지가 클라이언트 패칭 → SEO/성능 손해

SPECIFICATION.md가 Next.js를 택한 첫 번째 이유가 "SSG/SSR로 SEO 최적화"인데, 정작 핵심 페이지가 이를 살리지 못합니다.

- [src/app/page.tsx](src/app/page.tsx) (홈): `'use client'` + `useEffect`로 `/api/settings`, `/api/products`를 **브라우저에서** 패칭. 최초 HTML에는 기본값/빈 추천목록만 담겨 크롤러·LCP에 불리.
- `/contact`, `/faq`도 클라이언트 컴포넌트로 데이터 패칭(서브에이전트 조사 확인).
- 반면 `/about`, `/products`, `/trade`, `/location`, `/terms`, `/privacy`, 제품 상세는 서버 컴포넌트로 잘 구현됨.

**조치**: 홈/contact/faq를 **서버 컴포넌트로 전환**하고 데이터는 서버에서 주입(인터랙션이 필요한 부분만 작은 클라이언트 컴포넌트로 분리).

---

### 🟠 P1-2. 폰트 `!important` 충돌로 의도한 세리프가 무력화

[src/app/globals.css](src/app/globals.css)에 다음 규칙이 있습니다.

```css
main, main * { font-family: var(--font-body) !important; }
```

홈페이지([page.tsx](src/app/page.tsx))는 키커·대제목에 `style={{ fontFamily: "'Cormorant Garamond', serif" }}` **인라인 스타일**로 디스플레이 세리프를 지정합니다. 그러나 인라인(일반) 선언은 스타일시트의 `!important`를 이길 수 없으므로, **이 인라인 세리프들은 적용되지 않고 본문 산세리프(Pretendard)로 렌더**됩니다. (브랜드 워드마크 `.hero-brand-mark`/`.brand-wordmark`는 `!important`+클래스 우선순위라 정상 적용.)

**영향**: 에디토리얼 럭셔리 콘셉트의 핵심인 "Collection / Brand Story" 등 세리프 제목 톤이 사라져 디자인 의도가 약화.

**조치**: `main *` 강제 규칙을 걷어내고 폰트는 Tailwind `font-display`/`font-serif` 유틸리티로 일원화. (인라인 폰트 스타일도 클래스로 치환.)

---

### 🟡 P2-1. 로컬 영속성 부재 + 문서 불일치

- 실제 기본 경로는 `globalThis.__jujwStore` **인메모리**라 `next dev` 재시작 시 관리자 입력(제품/문의/설정)이 **소실**됩니다. README는 "로컬은 `data/local-db.json` fallback 사용"이라 적혀 있으나 이는 구버전(`site-data.ts`) 기준 설명으로 실제와 다릅니다.
- README의 스크립트(`npm run typecheck`, `preview`, `db:migrate:local`, `db:seed:local`, `cf-typegen`)와 `wrangler.jsonc` 언급이 **package.json/실파일과 불일치**.
- 관리자 기본 계정: README는 `admin@jujewelry.kr / admin1234!`, 그러나 [.env.local](.env.local)은 `ADMIN_EMAIL=1 / ADMIN_PASSWORD=1`. (로컬 한정이라 위험은 낮지만 혼선.)

**조치**: README/SETUP.md를 실제 구조에 맞게 갱신, package.json에 누락 스크립트 추가, 운영 비밀값 교체 가이드 명시.

---

### 🟡 P2-2. 미사용(죽은) 컴포넌트 잔존

import 검증 결과, `src/components/admin/`의 다수 컴포넌트가 페이지 인라인 구현으로 대체되어 **사용되지 않습니다.**

| 컴포넌트 | 사용 여부 |
|----------|-----------|
| `AdminLogoutButton` | ✅ 사용 (admin/layout) |
| `ProductsManager`, `SettingsForm`, `InquiriesManager`, `LoginForm`, `AdminShell` | ❌ 미사용 (구 `@/types/site` 의존) |
| `products/ProductsCatalog` | ❌ 미사용 |
| `home/SectionNav`, `home/FloatingCTA` | ❌ 미사용 |

**조치**: 삭제하여 번들/혼선 축소.

---

## 4. 보안 평가

### 강점 👍
- 비밀번호: **PBKDF2-SHA256 12만 회** 해시 + 솔트 ([src/lib/auth.ts](src/lib/auth.ts)).
- 세션: HMAC-SHA256 서명 JWT, `HttpOnly` + `SameSite=Lax`, HTTPS 시 `Secure`, 7일 만료.
- 관리자 라우트: 미들웨어로 보호 + 각 API에서 `requireAdmin` 재확인.
- 문의/로그인 **레이트리밋**(10분당 5회) + **허니팟** 스팸 차단 + 개인정보 동의 검증.
- 운영에서 `JWT_SECRET`/D1 미설정 시 명시적 throw (`ensurePersistentWrite`, `getJwtSecret`).

### 주의점 ⚠️
- JWT 검증 시 서명 비교가 단순 문자열 비교(`expected !== signature`) — 타이밍 세이프 비교 권장(엣지 환경에서 영향은 작음).
- `ADMIN_EMAIL/PASSWORD` 환경변수 평문 폴백 로그인 경로 존재 → 운영에서는 `admins` 테이블 계정만 쓰도록 폴백 비활성 고려.
- 레이트리밋이 **인메모리 Map** ([src/lib/rate-limit.ts](src/lib/rate-limit.ts)) → 엣지 다중 인스턴스에선 인스턴스별로만 적용(우회 가능). 강화하려면 D1/KV 기반 카운터.
- 운영 배포 전 `JWT_SECRET`, 관리자 비밀번호, `SITE_URL`, `R2_PUBLIC_BASE_URL` **반드시 교체**.

---

## 5. SEO 평가

| 항목 | 상태 |
|------|------|
| 메타데이터(title/description/OG/twitter) | ✅ 루트 + 페이지별 구현 |
| sitemap.xml / robots.txt | ✅ ([sitemap.ts](src/app/sitemap.ts), [robots.ts](src/app/robots.ts)) |
| JSON-LD (Product/Breadcrumb/FAQPage) | ✅ 구현 (단 FAQ는 클라이언트 렌더라 크롤러 인식 약함) |
| 시맨틱 HTML / canonical | ✅ 대체로 양호 |
| **홈 콘텐츠 SSR** | ⛔ 클라이언트 패칭 (P1-1) |
| SEO 랜딩 4종 내부 링크 | ⛔ sitemap엔 있으나 nav/footer 어디서도 링크되지 않아 **고아 페이지** |
| OG 이미지 | 🟡 전 페이지가 `/img/hero/hero.png` 공용 — 페이지별 차별화 여지 |

**조치**: 랜딩 페이지를 푸터/관련 섹션에 연결(내부 링크 자산화), 홈 SSR 전환, FAQ JSON-LD 서버 렌더.

---

## 6. 디자인 분석 & 개선 제안

### 잘 된 점 👍
- **일관된 팔레트**: 딥브라운(`#2f241d`~`#433125`) · 웜골드(`#a08c5b`/`#b68d5d`) · 아이보리(`#fbf7f2`) 조합이 럭셔리 톤에 부합.
- **이미지 에셋 풍부**: `public/img/products-generated/`, `about-generated/`, `location-generated/` 등 페이지별 데스크탑/모바일 이미지 완비.
- **반응형**: `100dvh` 히어로, `clamp()` 간격, 모바일 하단바 세이프에어리어 처리, 그리드 분기(2→4열).
- **마이크로 인터랙션**: 카드 hover scale, 슬라이드 메뉴, 백드롭 블러.

### 개선하면 좋은 점 ✨

1. **세리프 타이포 살리기 (최우선)** — P1-2 해결 시 에디토리얼 톤이 즉시 회복. 디스플레이 세리프(Cormorant)와 제목 세리프(Noto Serif KR)의 위계를 명확히.
2. **헤더 전략 통일** — 현재 홈/FAQ는 자체 헤더, 나머지는 공용 [Header.tsx](src/components/layout/Header.tsx)가 `pathname`으로 자기 자신을 숨기는 구조(+ `globals.css`의 `body.*-reference-page` 클래스로 푸터 토글). 페이지가 늘수록 깨지기 쉬움 → **단일 반응형 헤더/푸터로 통합**하고 변형은 prop으로.
3. **스크롤바 다크 테마 불일치** — `::-webkit-scrollbar-track: #1c1917`(검정 계열)이 아이보리 배경과 충돌. 브랜드 톤(웜그레이)으로 조정.
4. **제품 카드 가격 표기** — 전부 "가격 문의" 고정. B2B 특성상 합리적이나, 최소한 "도매가 상담"/"회원가" 등 맥락 카피로 다양화하면 신뢰도↑.
5. **빈 상태(Empty state) 디자인** — 추천 제품이 없을 때 fallback 더미 6종을 노출. 실제 운영 초기에 "준비 중" 우아한 빈 상태로 분기 권장.
6. **접근성 보강** — 일부 토글의 `aria-expanded` 누락, 색대비 자동검증 미실시, 장식 이미지 `alt` 정리. Lighthouse a11y 1회 점검 권장.
7. **OG/파비콘 전용 에셋** — 현재 `hero.png`를 파비콘·OG·아이콘에 공용. 정사각 파비콘과 1200×630 OG 전용 이미지 분리.
8. **모션 접근성** — `prefers-reduced-motion` 미대응. 페이드/스케일 애니메이션에 미디어쿼리 가드 추가.

---

## 7. 앞으로 남은 작업 (로드맵)

### 🔴 즉시 (배포 차단 요소)
- [ ] **배포 어댑터 단일화** (P0-2) — next-on-pages ↔ OpenNext 중 택1, 반대편/중복 설정 제거
- [ ] **구 데이터 계층 제거** (P0-1) — `/api/products/featured` 포함 정리, 타입 단일화
- [ ] 실제 **D1 생성 + `db/schema.sql` 적용** + R2 버킷 바인딩(`wrangler` 설정의 `database_id`/버킷명 실값 교체)
- [ ] 운영 비밀값 교체(`JWT_SECRET`, 관리자 계정, `SITE_URL`, `R2_PUBLIC_BASE_URL`)

### 🟠 출시 전
- [ ] 홈/contact/faq **SSR 전환** (P1-1) + FAQ JSON-LD 서버 렌더
- [ ] 폰트 `!important` 정리 (P1-2)
- [ ] 문서(README/SETUP) 실제 구조에 맞게 갱신, 누락 npm 스크립트 추가
- [ ] 도메인 연결(`jujewelry.co.kr`) + 운영 환경 스모크 테스트(로그인→제품 등록→이미지 업로드→문의 접수 E2E)

### 🟡 출시 후 품질
- [ ] 미사용 컴포넌트/에셋 정리 (P2-2)
- [ ] 레이트리밋 D1/KV 백엔드화
- [ ] Lighthouse(성능/접근성/SEO) 90+ 목표 점검
- [ ] 제품 수량 증가 대비 페이지네이션/검색, 문의 알림(이메일/슬랙) 연동 검토

---

## 8. 우선순위 액션 플랜 (요약)

| 우선순위 | 작업 | 효과 | 난이도 |
|:--------:|------|------|:------:|
| **P0** | 배포 어댑터 단일화 (OpenNext 권장) | 배포 가능 상태 확보 | 중 |
| **P0** | 구 데이터 계층/`featured` 라우트 제거 | 버그·혼선 제거 | 중 |
| **P0** | D1/R2 실바인딩 + 스키마 적용 + 비밀값 교체 | 데이터 영속성·보안 | 중 |
| **P1** | 홈/contact/faq SSR 전환 | SEO·LCP 개선 | 중 |
| **P1** | 폰트 `!important` 정리 | 디자인 의도 회복 | 하 |
| **P2** | 문서 갱신·미사용 코드 제거 | 유지보수성 | 하 |
| **P2** | 헤더/푸터 통합·접근성·OG 에셋 | 완성도 | 중 |

---

## 9. 결론

이 프로젝트는 **"보이는 부분(스토어프론트 UI/에셋/관리자 기능)은 거의 완성됐고, 보이지 않는 부분(배포 정합성·데이터 계층 일원화·SSR/SEO)이 미완"** 인 전형적인 "출시 직전 정리" 단계입니다.

가장 큰 리스크는 기능 부족이 아니라 **두 세대의 코드/설정이 공존하며 만드는 혼선**입니다. 따라서 새 기능보다 **(1) 배포 방식 확정, (2) 구버전 제거, (3) 실 인프라 바인딩**의 정리 작업을 먼저 끝내면, 그 위에서 SSR 전환·디자인 마감·SEO 마무리가 빠르게 안착할 수 있습니다. 정리만 완료되면 실제 오픈까지의 거리는 가깝습니다.

---

*이 리포트는 정적 코드 분석 기반입니다. 실제 Cloudflare 환경(D1/R2 바인딩) 배포 검증과 Lighthouse 측정은 별도 실행이 필요합니다.*
