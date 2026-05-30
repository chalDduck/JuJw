# Ju Jewelry · 연동 & 배포 가이드 (Supabase + Cloudflare Workers)

이 문서만 따라 하면 **데이터베이스 연결 → 로컬 확인 → 실제 배포**까지 끝납니다.
순서대로만 진행하세요. (소요 시간 약 15~20분)

> ⚠️ 비밀번호·키는 **채팅이나 코드에 붙여넣지 말고** 아래에서 안내하는 파일에만 넣으세요.

---

## A. Supabase 준비 (데이터베이스 + 사진 저장소)

### 1. 프로젝트 만들기
1. https://supabase.com 로그인 → **New project**
2. 이름(예: `ju-jewelry`), 비밀번호(자동 생성 사용 권장), 리전 **Northeast Asia (Seoul)** 선택 → 생성

### 2. 테이블/버킷 만들기 (한 번만)
1. 왼쪽 메뉴 **SQL Editor** → **New query**
2. 이 저장소의 [`supabase/schema.sql`](supabase/schema.sql) 내용을 **전체 복사**해서 붙여넣고 **Run**
   - 테이블 7개 + `product-images` 공개 버킷 + 예시 데이터가 자동 생성됩니다.
   - (여러 번 실행해도 안전합니다.)

### 3. 키 2개 복사
**Project Settings → API** 에서:
- **Project URL** → `SUPABASE_URL` 에 사용
- **`service_role` secret** (Project API keys 의 `service_role`) → `SUPABASE_SERVICE_ROLE_KEY` 에 사용
  - ⚠️ `service_role` 키는 **서버에서만** 쓰는 마스터 키입니다. 외부에 노출 금지.

---

## B. 로컬에서 확인하기

### 1. 키 입력
프로젝트 폴더의 **`.env.local`** 파일을 열고 두 줄을 채웁니다:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...(붙여넣기)
```

> `.env.local` 은 git에 올라가지 않습니다(안전). 비워두면 임시 메모리로 동작합니다.

### 2. 실행

```bash
npm install
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin
  - 아이디: `admin@jujewelry.kr` / 비밀번호: `admin1234!` (`.env.local`에서 변경 가능)

### 3. 동작 확인 체크리스트
- [ ] 홈/제품/공지사항 페이지가 보인다
- [ ] `/admin` 로그인 → **제품 관리**에서 제품 등록 + 사진 업로드가 된다
- [ ] 등록한 제품이 홈/제품 페이지에 보인다
- [ ] **공지사항** 작성 → `/notices` 에 보인다
- [ ] **문의 확인**: `/contact` 에서 상담 요청 → `/admin/inquiries` 에 뜬다

---

## C. Cloudflare Workers 배포

### 1. 로그인 (한 번만)

```bash
npx wrangler login
```

브라우저가 열리면 Cloudflare 계정으로 허용합니다.

### 2. 비밀값 등록 (한 번만)
아래를 한 줄씩 실행하고, 물어보면 값을 입력합니다:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put JWT_SECRET            # 길고 랜덤한 문자열
npx wrangler secret put ADMIN_EMAIL           # 관리자 아이디
npx wrangler secret put ADMIN_PASSWORD        # 강력한 비밀번호
```

> `SITE_URL` 은 `wrangler.jsonc` 의 `vars` 에 들어 있습니다. 배포 후 실제 주소로 바꾸면 됩니다.

### 3. 배포

```bash
npm run deploy
```

끝나면 `https://jujw.<당신-계정>.workers.dev` 주소가 출력됩니다.

### 4. (선택) GitHub 자동 배포
`main` 브랜치에 push하면 자동 배포됩니다. GitHub 저장소 **Settings → Secrets and variables → Actions** 에 추가:
- `CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API Tokens, "Edit Cloudflare Workers" 템플릿)
- `CLOUDFLARE_ACCOUNT_ID` (Workers 대시보드 우측에 표시)

---

## D. 운영 시작 전 보안 체크
- [ ] `ADMIN_PASSWORD` 를 추측 어려운 값으로 변경
- [ ] `JWT_SECRET` 를 길고 랜덤한 값으로 설정
- [ ] (권장) 채팅 등에 노출된 계정 비밀번호가 있다면 변경

---

## 자주 쓰는 명령어

| 명령 | 설명 |
|------|------|
| `npm run dev` | 로컬 개발 서버 |
| `npm run build` | 빌드 확인 |
| `npm run typecheck` | 타입 검사 |
| `npm run preview` | Cloudflare 환경으로 로컬 미리보기 |
| `npm run deploy` | Cloudflare Workers 배포 |

## 문제 해결
- **관리자 글이 사이트에 안 보임** → 제품/공지의 "공개/보임"이 켜져 있는지 확인.
- **사진이 안 올라감** → Supabase에서 `supabase/schema.sql` 을 실행했는지(=`product-images` 버킷 생성) 확인.
- **로그인이 안 됨** → `.env.local`(로컬) 또는 `wrangler secret`(배포)의 `ADMIN_EMAIL`/`ADMIN_PASSWORD` 확인.
- **데이터가 저장 안 되고 새로고침하면 사라짐** → Supabase 키가 비어 있어 임시 메모리로 동작 중입니다. `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` 를 채우세요.
