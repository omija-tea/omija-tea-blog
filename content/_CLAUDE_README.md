---
title: Claude 블로그 관리 사용 가이드
publish: false
tags:
  - type/note
---

# Claude 블로그 관리 사용 가이드

Claude Code를 이 blog 폴더에서 실행하면 자동으로 블로그 관리자 모드로 동작합니다.

---

## 글쓰기 워크플로

### 1. 새 글 작성

**Templater로 직접 작성하는 경우** (일반적)
- `blog/temp/` 폴더에 파일 생성 → 본문 작성 → 정리 요청

**Claude에게 초안 요청하는 경우**
```
/new-post Docker로 FastAPI 배포하기
```
Claude가 `blog/temp/`에 frontmatter + 본문 골격을 만들어줍니다.

---

### 2. 임시 글 정리 (`/organize-temp`)

`temp/`에 글이 쌓이면:
```
/organize-temp
```

Claude가 각 글을 읽고 다음을 수행합니다:
- **어느 폴더로 옮길지** 제안 (기존 폴더 또는 새 폴더 신설 제안)
- **태그 추가** — frontmatter에 적절한 `topic/*`, `type/*` 태그 자동 보강
- **wikilink 후보** — 연관된 기존 글 제안 (삽입은 사용자 확인 후)
- **publish 필드** — 보안 체크 후 경고

> **파일 이동은 사용자가 Obsidian에서 직접** 수행합니다.
> Obsidian의 자동 wikilink 갱신 기능을 활용하기 위함.
> Claude의 제안을 보고, Obsidian 탐색기에서 드래그하세요.

이동 완료 후 "정리 완료"라고 알리면 Claude가 폴더 지도를 갱신합니다.

---

## 태그 관리 (자동)

**태그는 사용자가 직접 건드리지 않아도 됩니다.**

Claude가 .md 파일을 편집할 때마다 `scripts/tag-sync.py`가 자동으로 실행되어:
- 사용된 신규 태그를 `blog/_tags.md`에 등록
- `blog/index.md`의 `tags:` 배열을 자동 재생성

태그 카탈로그는 `blog/_tags.md` 한 파일이 정본입니다.

### 태그 정합성 검사가 필요할 때
```
/tag-audit
```
또는 직접:
```bash
python 'C:/Users/SSAFY/Documents/Obsidian Vault/scripts/tag-sync.py'
```

---

## 세션 시작 시 자동 알림

Claude Code 세션을 시작하면 자동으로:
- `blog/temp/`에 정리 대기 중인 글이 있으면 목록 출력

---

## 정기 점검 (`/maintenance`)

가끔 한 번씩 실행하면 됩니다:
```
/maintenance
```

- 태그 정합성 검사
- temp 폴더 미정리 글 확인
- 폴더 지도 검증
- 고립 노트 탐지 (wikilink 없는 글)
- 최근 글 보안 샘플 점검

---

## 폴더 구조

```
blog/
├── temp/              ← 새 글 작성 시 임시 저장
│   └── _README.md     ← temp 폴더 사용법
├── 개발/              ← 개발 관련 글 (백엔드·인프라·DB·도구·모바일·아키텍처)
├── 블로그 구축/       ← 블로그 구축 시리즈
├── Attachment/        ← 이미지·첨부 (Obsidian이 자동 관리)
├── _tags.md           ← 태그 카탈로그 정본 (Claude가 관리, 직접 편집 X)
├── index.md           ← 블로그 홈 (tags 배열은 자동 생성, 직접 편집 X)
└── .claude/           ← Claude Code 설정 (skills, commands, hooks)
```

새 카테고리 폴더가 필요하면 Claude가 제안하고, **사용자가 Obsidian에서 생성** 후 알려주면 됩니다.

---

## 슬래시 커맨드 요약

| 커맨드 | 설명 |
|--------|------|
| `/organize-temp` | temp 폴더 글 분류 제안 |
| `/new-post <주제>` | 새 글 초안 생성 |
| `/tag-audit` | 태그 정합성 검사 + 자동 수정 |
| `/maintenance` | 블로그 전체 정기 점검 |

---

## 하지 말 것

| ❌ | 이유 |
|----|------|
| `_tags.md` 직접 편집 | `tag-sync.py`가 덮어쓸 수 있음 |
| `index.md`의 `tags:` 배열 직접 편집 | 항상 `_tags.md`에서 자동 재생성됨 |
| Claude에게 파일 이동 요청 | wikilink가 깨짐. Obsidian에서 직접 이동 |

---

## 자동화 파일 위치

| 파일 | 역할 |
|------|------|
| `blog/.claude/settings.json` | SessionStart·PostToolUse 훅 설정 |
| `blog/.claude/skills/` | blog-organizer, tag-curator, link-weaver |
| `blog/.claude/commands/` | 슬래시 커맨드 정의 |
| `scripts/tag-sync.py` | 태그 동기화 스크립트 (vault 루트의 scripts/) |
| `blog/CLAUDE.md` | 블로그 운영 상세 매뉴얼 (Claude가 읽는 파일) |
