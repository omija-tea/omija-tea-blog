---
name: blog-organizer
description: temp/ 폴더의 미분류 블로그 초고에 대해 적절한 카테고리 폴더를 추천하고, 태그·wikilink·publish 필드 정비안을 제시할 때 사용. 사용자가 "임시글 정리", "이거 어디 폴더로 가야돼", "분류해줘" 등을 요청하거나 /organize-temp 슬래시 커맨드를 실행할 때 발동. **파일·폴더 이동은 직접 수행하지 않고 사용자가 Obsidian UI에서 진행하도록 안내** (Obsidian의 자동 wikilink 갱신을 활용하기 위함).
---

# Blog Organizer

`blog/temp/`에 누적된 초고에 대해 분류 계획을 수립하고, 분류 결정의 부산물(태그/링크/폴더 지도)을 일관되게 갱신하는 스킬.

> **이동 정책**: 파일 이동과 신규 폴더 생성은 **절대 직접 수행하지 않는다**. 노트 간 wikilink가 깨지지 않도록 사용자가 Obsidian UI에서 직접 옮기게 안내한다. Claude는 "어디서 어디로 옮길지", "무슨 폴더를 새로 만들지"를 명시적으로 보고하는 역할.

## 입력 가정

- 작업 디렉토리는 `blog/` 또는 그 하위
- temp 글은 Templater가 만든 frontmatter (`title`, `date`, `tags`, `publish`)를 가짐
- `_README.md`, `_*.md` 패턴은 영구 파일이므로 절대 이동하지 않음

## 절차

### 1. 스캔
```bash
ls "blog/temp/" | grep -v '^_'
```
0개면 "정리할 글 없음" 보고 후 종료.

### 2. 각 글에 대해

**(a) 본문 읽기** — frontmatter + 본문 첫 ~50줄로 주제 판단.

**(b) 카테고리 결정 (제안만)** — `blog/CLAUDE.md`의 폴더 지도 표를 기준으로:
- 기존 폴더 중 의미적으로 매칭되는 곳이 있으면 그곳을 **추천 대상**으로
- 폴더 지도의 어떤 카테고리에도 자연스럽게 안 들어가면 **새 폴더 신설을 제안** (생성하지 않음)
  - 폴더명 후보는 한글 명사구 (예: `데이터 사이언스`, `독서 노트`)
- 결정은 사용자에게. 애매한 경우 후보 2~3개 제시

**(c) 태그 보강** — frontmatter `tags`를 다음 규칙으로 정비:
- 정본 `blog/_tags.md`의 `topic/*` 목록과 본문 내용을 매칭하여 누락 태그 추가
- `type/note | type/log | type/idea` 중 본문 성격에 맞는 1개 보장
- 매칭되는 기존 태그가 없으면 **`tag-curator` 스킬 호출** (절차 A: 신규 태그 등록)
  - `tag-curator`가 _tags.md에 행 추가 + index.md tags 배열 자동 동기 처리
  - blog-organizer는 글 frontmatter에 추가만 담당

**(d) publish 필드 점검**
- 기본은 `publish: true`
- vault CLAUDE.md "블로그 글 작업 전 보안 체크리스트" 항목(회사명·도메인·실명·credential) 발견 시 `publish: false`로 두고 사용자에게 보고

**(e) wikilink 제안** — 같은 폴더 또는 같은 `topic/*` 태그를 가진 기존 글 중 본문이 언급하는 개념과 일치하는 것을 1~3개 골라 본문 적절한 위치에 `[[제목]]` 삽입 후보 제안. **사용자 확인 후에만 실제 삽입**.

**(f) 이동 안내 (직접 이동 금지)** — 사용자가 Obsidian UI에서 직접 옮기도록 다음 형식으로 안내:
- "Obsidian에서 `<파일>`을 `<대상폴더>`로 드래그하세요"
- 신규 폴더가 필요하면 "먼저 `blog/` 우클릭 → 새 폴더 `<이름>` 생성 후 이동"
- Obsidian이 자동으로 wikilink 경로를 갱신함 (Settings → Files & Links → Automatically update internal links 활성화 가정)

### 3. 마무리 보고

각 파일마다:
```
□ <원본명>
  → 추천 위치: blog/<카테고리>/  (이유: ...)
  → 태그 패치 적용됨: +topic/X (신규), +type/note
  → 링크 후보: [[글A]], [[글B]]  (승인하시면 본문에 삽입)
  → publish: true | false (이유)
```

마지막 종합 보고:
1. **사용자 액션 필요**: Obsidian에서 옮길 파일 목록 (대상 폴더별로 그룹핑)
2. **신규 폴더 생성 필요**: (있다면) 만들 폴더 이름과 이유
3. **자동 적용된 변경**: frontmatter 태그/publish, _tags.md / index.md 갱신 내역 (tag-curator 위임)
4. **사용자 확인 대기**: wikilink 삽입 후보

> 이동이 끝나면 사용자가 `/organize-temp confirm` 또는 "정리 확인"이라고 말함. 그때 폴더 지도(`blog/CLAUDE.md`)에 신규 폴더가 생긴 것을 반영.

## 안전장치

- **`mv`, `Move-Item`, 폴더 생성 명령 일체 금지** — 사용자만 Obsidian에서 수행
- frontmatter 편집(태그/publish)은 in-place로 안전하게 수행 (파일 위치는 그대로)
- 같은 이름 파일이 대상 폴더에 이미 있으면 명확히 보고 (덮어쓰기 방지를 위해 이름 충돌은 사용자에게)
- 한 번의 호출에서 신규 폴더 제안은 최대 2개까지 (남용 방지)
- 본문이 비어있거나 한 줄짜리 메모면 분류 보류 통보
