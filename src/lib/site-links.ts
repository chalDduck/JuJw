// 사이트 전역에서 쓰는 외부 링크/지도. 값이 바뀌면 이 파일만 수정하면 됩니다.

// 카톡 오픈채팅
export const KAKAO_OPENCHAT_URL = 'https://open.kakao.com/o/snyzjqxi'

// 구글 지도 (ju주얼리 · 서울 종로구 종로 173)
// 좌표: 37.5709401, 126.9969905
const GOOGLE_MAPS_PLACE_BASE_URL =
  'https://www.google.com/maps/place/ju%EC%A3%BC%EC%96%BC%EB%A6%AC/data=!3m1!4b1!4m6!3m5!1s0x357ca36701a34871:0xeaf25f186d2caae5!8m2!3d37.5709401!4d126.9969905!16s%2Fg%2F11zc4pzrh2?hl=ko'

export const GOOGLE_MAPS_PLACE_URL = GOOGLE_MAPS_PLACE_BASE_URL
export const GOOGLE_MAPS_EMBED_URL = `${GOOGLE_MAPS_PLACE_BASE_URL}&output=embed`
