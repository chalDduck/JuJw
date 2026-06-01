-- =============================================================================
--  Ju Jewelry · Supabase (PostgreSQL) 스키마
--  Supabase 대시보드 > SQL Editor 에 붙여넣고 "Run" 하세요. 여러 번 실행해도 안전합니다.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) 테이블
-- ---------------------------------------------------------------------------

create table if not exists categories (
  id          bigint generated always as identity primary key,
  name        text not null,
  slug        text not null unique,
  icon        text,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists products (
  id          bigint generated always as identity primary key,
  category_id bigint not null references categories(id) on delete restrict,
  name        text not null,
  slug        text not null unique,
  spec        text,
  description text,
  is_featured  boolean not null default false,
  is_published boolean not null default true,
  order_index integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_products_category   on products(category_id);
create index if not exists idx_products_featured    on products(is_featured);
create index if not exists idx_products_published   on products(is_published);

create table if not exists product_images (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references products(id) on delete cascade,
  object_key  text,
  url         text not null,
  alt_text    text,
  is_primary  boolean not null default false,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_product_images_product on product_images(product_id);

create table if not exists inquiries (
  id           bigint generated always as identity primary key,
  company_name text not null,
  phone        text not null,
  interest     text,
  message      text,
  status       text not null default 'pending',
  ip_address   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_inquiries_status on inquiries(status);

create table if not exists settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

create table if not exists admins (
  id            bigint generated always as identity primary key,
  email         text not null unique,
  password_hash text not null,
  name          text,
  created_at    timestamptz not null default now()
);

create table if not exists notices (
  id           bigint generated always as identity primary key,
  title        text not null,
  content      text not null,
  is_published boolean not null default true,
  is_pinned    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_notices_published on notices(is_published);

-- ---------------------------------------------------------------------------
-- 2) RLS (Row Level Security)
--    서버는 service_role 키로 접속해 RLS를 우회합니다.
--    아래처럼 RLS만 켜고 정책을 두지 않으면, 외부(anon 키)로는 직접 접근이 차단됩니다.
-- ---------------------------------------------------------------------------

alter table categories     enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table inquiries      enable row level security;
alter table settings       enable row level security;
alter table admins         enable row level security;
alter table notices        enable row level security;

-- ---------------------------------------------------------------------------
-- 3) Storage 버킷 (제품 사진 공개 버킷)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 공개 읽기 허용 (이미지 URL 노출용). 업로드/삭제는 service_role(서버)만 수행.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Public read product-images'
  ) then
    create policy "Public read product-images"
      on storage.objects for select
      using (bucket_id = 'product-images');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 4) 기초 데이터 (seed) — 카테고리/예시 제품/예시 공지. 여러 번 실행해도 중복되지 않음.
-- ---------------------------------------------------------------------------

insert into categories (name, slug, icon, order_index) values
  ('반지',   'rings',     '💍', 1),
  ('목걸이', 'necklaces', '📿', 2),
  ('귀걸이', 'earrings',  '💎', 3),
  ('팔찌',   'bracelets', '⌚', 4),
  ('액세서리', 'accessories', '✦', 5)
on conflict (slug) do nothing;

insert into notices (title, content, is_published, is_pinned)
select
  'Ju Jewelry 홈페이지를 새단장했습니다',
  '제품 구성과 상담 안내를 보기 쉽게 정리했습니다. 궁금한 점은 언제든 문의 페이지에서 편하게 남겨 주세요.',
  true,
  true
where not exists (select 1 from notices);
