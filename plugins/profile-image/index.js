// Profile Image — omija-tea 커스텀 로컬 플러그인 (v5)
// 메인 엔트리: manifest 재노출 + 컴포넌트 재노출.
// 실제 컴포넌트 등록은 loader가 package.json quartz.components + ./components 서브패스로 처리.
import pkg from "./package.json" with { type: "json" }

export const manifest = pkg.quartz

export { ProfileImage } from "./components/index.js"
