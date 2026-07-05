// Fonts (CDN) — omija-tea 커스텀 로컬 플러그인 (v5)
// v4 custom.scss의 @import(Pretendard) 를 대체.
// CSS 번들의 "@import는 최상단" 제약을 피하기 위해 head <link>로 웹폰트를 주입한다.
import pkg from "./package.json" with { type: "json" }

export const manifest = pkg.quartz

const FONT_STYLESHEETS = [
  // Pretendard Variable (dynamic subset) — 구글폰트에 없어 jsdelivr CDN 사용
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  // IBM Plex Mono — 코드 폰트
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
]

export const FontsCdn = () => ({
  name: "FontsCdn",
  // externalResources: head에 <link rel="stylesheet"> 로 주입됨
  externalResources() {
    return {
      css: FONT_STYLESHEETS.map((href) => ({ content: href, spaPreserve: true })),
    }
  },
  // transformer 카테고리 검증(textTransform|markdownPlugins|htmlPlugins 중 하나 필요) 통과용 no-op
  markdownPlugins() {
    return []
  },
})

export default FontsCdn
