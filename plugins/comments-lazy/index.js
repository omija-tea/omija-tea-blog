// Comments (giscus, lazy) — omija-tea 커스텀 로컬 플러그인 (v5)
// 스톡 comments 컴포넌트를 복제하되, afterDOMLoaded를 v4 인터랙션 기반 lazy-load로 교체.
import pkg from "./package.json" with { type: "json" }

export const manifest = pkg.quartz

export { Comments } from "./components/index.js"
