# Ju Jewelry

Next.js 14 기반 Ju Jewelry 스토어프론트 + 관리자 사이트입니다.
공개 페이지, 제품/공지/문의 관리, 상담 접수, Cloudflare Workers 배포를 포함합니다.

## Stack

- **Next.js 14** (App Router) + Tailwind CSS
- **Supabase** (PostgreSQL DB + Storage 이미지)
- **Cloudflare Workers** 배포 (`@opennextjs/cloudflare`)
- 자체 JWT 관리자 인증 (PBKDF2 해시)
- Supabase 키가 없으면 로컬 임시 메모리로 동작 (개발 편의)

## 빠른 시작

```bash
npm install
npm run dev          # http://localhost:3000  ·  관리자: /admin
```

> 실제 DB 연결과 배포는 **[SETUP_GUIDE.md](SETUP_GUIDE.md)** 를 순서대로 따라 하세요.

## Scripts

| 명령 | 설명 |
|------|------|
| `npm run dev` | 로컬 개발 서버 |
| `npm run build` | Next.js 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run preview` | OpenNext로 Cloudflare 환경 로컬 미리보기 |
| `npm run deploy` | Cloudflare Workers 배포 |
| `npm run cf-typegen` | Cloudflare 타입 생성 |

## 환경 변수

`.env.local`(로컬) 또는 `wrangler secret`(배포)에 설정합니다.

| 변수 | 용도 |
|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 service_role 키 |
| `SUPABASE_STORAGE_BUCKET` | 이미지 버킷명 (기본 `product-images`) |
| `JWT_SECRET` | 관리자 세션 서명 키 |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 관리자 로그인 계정 |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | 사이트 절대 URL (SEO/쿠키) |

## 관리자

- 접속: `/admin` (휴대폰에서도 같은 주소)
- 로컬 기본 계정: `admin@jujewelry.kr` / `admin1234!` — **운영 시 반드시 변경**
- 제품/사진, 공지사항, 문의, 홈 문구, FAQ, 매장 정보를 관리합니다.

## 데이터베이스

- 스키마/시드: [`supabase/schema.sql`](supabase/schema.sql) 를 Supabase SQL Editor에서 1회 실행
- 테이블: categories, products, product_images, inquiries, settings, admins, notices

## Notes

- 소개/거래 안내/약관 등 일부 본문은 코드로 관리하고, 제품·문의·공지·연락처/문구는 관리자에서 관리합니다.
- 모든 공개 페이지는 서버 렌더링(SSR)되어 SEO에 노출됩니다.
