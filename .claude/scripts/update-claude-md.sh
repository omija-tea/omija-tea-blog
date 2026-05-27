#!/usr/bin/env bash
# update-claude-md.sh
# CLAUDE.md의 컴포넌트·플러그인 목록 섹션을 자동으로 갱신합니다.
# PostToolUse 훅에서 호출됩니다 (quartz/components/ 또는 quartz/plugins/ 파일 수정 시).

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CLAUDE_MD="$REPO_ROOT/CLAUDE.md"

# CLAUDE.md가 없으면 종료
if [[ ! -f "$CLAUDE_MD" ]]; then
  exit 0
fi

# ──────────────────────────────────────────────
# 컴포넌트 목록 생성
# ──────────────────────────────────────────────
COMP_DIR="$REPO_ROOT/quartz/components"
COMP_LINES=""

declare -A COMP_DESC=(
  ["ArticleTitle.tsx"]="글 제목 표시"
  ["Backlinks.tsx"]="역링크 목록"
  ["Body.tsx"]="본문 컨테이너"
  ["Breadcrumbs.tsx"]="경로 탐색 (빵 부스러기)"
  ["Comments.tsx"]="Giscus 댓글 (인터랙션 기반 lazy load)"
  ["ConditionalRender.tsx"]="★ 커스텀: 조건부 컴포넌트 렌더링 래퍼"
  ["ContentMeta.tsx"]="글 메타 정보 (날짜, 읽기 시간 등)"
  ["Darkmode.tsx"]="다크모드 토글"
  ["Date.tsx"]="날짜 포맷"
  ["DesktopOnly.tsx"]="데스크톱 전용 래퍼"
  ["Explorer.tsx"]="파일 탐색기 사이드바"
  ["Flex.tsx"]="플렉스 레이아웃 래퍼"
  ["Footer.tsx"]="푸터"
  ["Graph.tsx"]="그래프 뷰"
  ["Header.tsx"]="헤더"
  ["Head.tsx"]="HTML <head> (SEO, 메타)"
  ["MobileOnly.tsx"]="모바일 전용 래퍼"
  ["OverflowList.tsx"]="오버플로우 목록"
  ["PageList.tsx"]="페이지 목록"
  ["PageTitle.tsx"]="사이트 제목"
  ["ProfileImage.tsx"]="★ 커스텀: 프로필 사진 (/static/profile.png, 80px 원형)"
  ["ReaderMode.tsx"]="리더 모드"
  ["RecentNotes.tsx"]="최근 글 목록"
  ["Search.tsx"]="전체 텍스트 검색"
  ["Spacer.tsx"]="공백"
  ["TableOfContents.tsx"]="목차"
  ["TagList.tsx"]="태그 목록"
  ["pages/404.tsx"]="404 페이지"
  ["pages/Content.tsx"]="콘텐츠 페이지"
  ["pages/FolderContent.tsx"]="폴더 목록 페이지"
  ["pages/TagContent.tsx"]="태그 목록 페이지"
)

COMP_LINES="| 파일 | 설명 |\n|------|------|\n"
while IFS= read -r -d '' filepath; do
  rel="${filepath#$COMP_DIR/}"
  # index.ts, types.ts, styles/, scripts/ 제외
  [[ "$rel" == *.ts && "$rel" != *.tsx ]] && continue
  [[ "$rel" == styles/* || "$rel" == scripts/* ]] && continue
  [[ "$rel" == types.ts || "$rel" == index.ts || "$rel" == renderPage.tsx ]] && continue

  desc="${COMP_DESC[$rel]:-}"
  if [[ -z "$desc" ]]; then
    # 파일에서 첫 번째 export default 위의 주석이나 컴포넌트명 추출 시도
    desc="(설명 없음 — 추가 시 스크립트 COMP_DESC 배열에 기입)"
  fi
  COMP_LINES+="| \`$rel\` | $desc |\n"
done < <(find "$COMP_DIR" -name "*.tsx" -not -path "*/scripts/*" -not -path "*/styles/*" -print0 | sort -z)

# ──────────────────────────────────────────────
# 플러그인 목록 생성
# ──────────────────────────────────────────────
PLUGIN_DIR="$REPO_ROOT/quartz/plugins"
PLUGIN_LINES="**Transformers:**\n"

# Transformers
while IFS= read -r -d '' filepath; do
  fname="$(basename "$filepath")"
  [[ "$fname" == "index.ts" ]] && continue
  PLUGIN_LINES+="- \`$fname\`\n"
done < <(find "$PLUGIN_DIR/transformers" -name "*.ts" -print0 | sort -z)

PLUGIN_LINES+="\n**Filters:**\n"
while IFS= read -r -d '' filepath; do
  fname="$(basename "$filepath")"
  [[ "$fname" == "index.ts" ]] && continue
  PLUGIN_LINES+="- \`$fname\`\n"
done < <(find "$PLUGIN_DIR/filters" -name "*.ts" -print0 | sort -z)

PLUGIN_LINES+="\n**Emitters:**\n"
while IFS= read -r -d '' filepath; do
  fname="$(basename "$filepath")"
  [[ "$fname" == "index.ts" || "$fname" == "helpers.ts" ]] && continue
  PLUGIN_LINES+="- \`$fname\`\n"
done < <(find "$PLUGIN_DIR/emitters" \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)

# ──────────────────────────────────────────────
# CLAUDE.md 섹션 교체 (python3 사용 — 멀티라인 sed 대안)
# ──────────────────────────────────────────────
python3 - "$CLAUDE_MD" "$COMP_LINES" "$PLUGIN_LINES" <<'PYEOF'
import sys, re

claude_md_path = sys.argv[1]
comp_lines = sys.argv[2]
plugin_lines = sys.argv[3]

with open(claude_md_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 컴포넌트 섹션 교체
comp_block = f"<!-- AUTO-GENERATED: components-list START -->\n{comp_lines}\n<!-- AUTO-GENERATED: components-list END -->"
content = re.sub(
    r'<!-- AUTO-GENERATED: components-list START -->.*?<!-- AUTO-GENERATED: components-list END -->',
    comp_block,
    content,
    flags=re.DOTALL
)

# 플러그인 섹션 교체
plugin_block = f"<!-- AUTO-GENERATED: plugins-list START -->\n{plugin_lines}\n<!-- AUTO-GENERATED: plugins-list END -->"
content = re.sub(
    r'<!-- AUTO-GENERATED: plugins-list START -->.*?<!-- AUTO-GENERATED: plugins-list END -->',
    plugin_block,
    content,
    flags=re.DOTALL
)

with open(claude_md_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("[CLAUDE.md] 컴포넌트·플러그인 목록 자동 갱신 완료")
PYEOF
