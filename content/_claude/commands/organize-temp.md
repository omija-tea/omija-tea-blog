---
description: temp 폴더의 미분류 글에 대해 분류 계획을 제시 (이동은 사용자가 Obsidian에서 수행)
---

`blog/temp/` 폴더의 모든 글(단, `_*.md` 제외)에 대해 정리 계획을 만드세요.

`blog-organizer` 스킬을 따라:
1. 각 글의 본문을 읽고 `blog/CLAUDE.md` 폴더 지도에 따라 **추천 폴더 결정**
2. 매칭 폴더 없으면 **새 폴더 신설을 제안** (직접 만들지 말 것)
3. frontmatter 태그 보강은 in-place로 수행, 신규 태그면 `tag-curator`로 카탈로그 3종 동기화
4. `link-weaver`로 wikilink 후보 제안 (삽입은 사용자 확인 후)
5. **사용자 액션 보고서** 출력:
   - Obsidian에서 옮길 파일 (어디 → 어디)
   - 만들어야 할 신규 폴더 (있다면)
   - 자동 적용된 변경 (태그/카탈로그)
   - 확인 대기 항목 (링크/publish)

> **파일 이동·폴더 생성은 절대 자동 수행 금지**. wikilink가 깨질 위험을 피하기 위해 사용자가 Obsidian UI에서 직접 옮기고, Obsidian의 link auto-update에 위임합니다.
> 사용자가 이동을 마치고 "정리 확인" 또는 `/organize-temp confirm` 으로 알리면 그때 `blog/CLAUDE.md` 폴더 지도에 신규 폴더를 추가하세요.
