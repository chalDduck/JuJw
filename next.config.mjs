import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

// 로컬 `next dev`에서 Cloudflare 컨텍스트를 초기화합니다.
initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 이미지는 Supabase Storage / public 자산을 직접 사용하므로 최적화기를 끕니다.
    unoptimized: true,
  },
}

export default nextConfig
