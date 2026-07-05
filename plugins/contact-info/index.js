// Contact Info — omija-tea 커스텀 로컬 플러그인 (v5)
// 이메일/인스타그램/전화 아이콘 링크. 좌측 사이드바 "정남준 블로그" 아래(priority 15).
import pkg from "./package.json" with { type: "json" }

export const manifest = pkg.quartz

export { ContactInfo } from "./components/index.js"
