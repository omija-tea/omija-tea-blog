# CLAUDE.md — omija-tea Quartz 블로그 프로젝트

> 이 파일은 Claude Code가 이 프로젝트를 수정할 때 참조하는 **살아있는 매뉴얼**입니다.
> 파일 추가/수정 시 관련 섹션을 자동으로 갱신합니다 (PostToolUse 훅).

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **이름** | omija-tea 개인 블로그 |
| **엔진** | [Quartz 4](https://quartz.jzhao.xyz/) (v4.5.2) — Markdown → 정적 사이트 생성 |
| **도메인** | `blog.omija-tea.work` (CNAME) |
| **배포** | GitHub Actions → GitHub Pages (branch: `v4`) |
| **콘텐츠 작성** | Obsidian + Templater |
| **언어** | `ko-KR` |
| **폰트** | Pretendard Variable (CDN), IBM Plex Mono (코드) |
| **댓글** | Giscus (repo: `omija-tea/omija-tea-blog`) |
| **Analytics** | Google Analytics (`G-VLZ0VXMVX9`) |

---

## 2. 디렉터리 구조

```
/home/playjnj/quartz/
├── quartz.config.ts        ← ★ 메인 설정 (플러그인, 테마, analytics)
├── quartz.layout.ts        ← ★ 레이아웃 설정 (컴포넌트 배치)
├── CLAUDE.md               ← 이 파일 (Claude 참조용)
├── CNAME                   ← blog.omija-tea.work
├── Dockerfile              ← 멀티스테이지 빌드 (node:22-slim)
├── package.json            ← quartz v4.5.2, node>=22, npm>=10.9.2
├── tsconfig.json
│
├── content/                ← ★ 블로그 글 (Obsidian vault)
│   ├── index.md            ← 홈 페이지
│   ├── _tags.md            ← 태그 카탈로그 정본 (publish:false, Claude 관리)
│   ├── 개발/               ← 개발 관련 글 (백엔드·인프라·DB·모바일·아키텍처)
│   ├── 블로그 구축/        ← 블로그 구축 시리즈
│   ├── Attachment/         ← 이미지·첨부파일
│   ├── temp/               ← 미분류 초고 (임시)
│   └── CLAUDE.md           ← 블로그 콘텐츠 운영 매뉴얼 (별도)
│
├── quartz/                 ← ★ Quartz 엔진 소스
│   ├── components/         ← UI 컴포넌트 (.tsx)
│   ├── plugins/            ← 빌드 플러그인
│   │   ├── transformers/   ← Markdown 변환
│   │   ├── filters/        ← 페이지 발행 필터
│   │   └── emitters/       ← HTML 파일 생성
│   ├── styles/             ← 컴포넌트별 SCSS
│   └── util/               ← 유틸리티
│
├── styles/
│   └── custom.scss         ← ★ 전역 커스텀 스타일 (Pretendard CDN import)
│
├── static/                 ← 정적 파일
│   ├── fonts/              ← 로컬 폰트
│   └── (profile.png 등)   ← ProfileImage 컴포넌트가 /static/profile.png 참조
│
└── .claude/
    ├── settings.local.json ← Claude Code 권한 설정
    └── scripts/
        └── update-claude-md.sh ← CLAUDE.md 파일 목록 자동 갱신 스크립트
```

---

## 3. Quartz 4 동작 원리

```
content/*.md
    ↓ Transformers (Markdown 파싱·변환)
    ↓ Filters (발행 여부 결정)
    ↓ Emitters (HTML 파일 생성)
→ public/ (빌드 결과)
    → GitHub Pages 배포
```

### 플러그인 3종류
| 종류 | 역할 | 파일 위치 |
|------|------|-----------|
| **Transformer** | Markdown AST 변환 (frontmatter, 링크, 수식, 코드 하이라이트 등) | `quartz/plugins/transformers/` |
| **Filter** | 페이지 발행 여부 결정 | `quartz/plugins/filters/` |
| **Emitter** | 최종 HTML/파일 생성 | `quartz/plugins/emitters/` |

---

## 4. 핵심 설정 파일 상세

### `quartz.config.ts`
- **analytics**: Google Analytics `G-VLZ0VXMVX9`
- **baseUrl**: `blog.omija-tea.work`
- **locale**: `ko-KR`
- **ignorePatterns**: `private/`, `templates/`, `.obsidian`, `.trash`, `_attachments/.obsidian`
- **defaultDateType**: `modified`
- **폰트**: Pretendard Variable (header/body), IBM Plex Mono (code)
- **publish 필터**: `ExplicitPublish` — frontmatter에 `publish: true`인 글만 배포

**활성 Transformer 플러그인:**
- `FrontMatter`, `CreatedModifiedDate` (priority: frontmatter→filesystem)
- `SyntaxHighlighting` (github-light/dark)
- `ObsidianFlavoredMarkdown`, `GitHubFlavoredMarkdown`
- `TableOfContents`, `CrawlLinks` (shortest 해상도), `Description`, `Latex` (katex)

**활성 Emitter 플러그인:**
- `AliasRedirects`, `ComponentResources`, `ContentPage`, `FolderPage`, `TagPage`
- `ContentIndex` (RSS + SiteMap 활성화, rssFullHtml: true)
- `Assets`, `Static`, `NotFoundPage`, `Favicon`, `CustomOgImages`

### `quartz.layout.ts`
레이아웃은 3개 영역 + 공통(shared)으로 구성:

**SharedLayout (모든 페이지 공통):**
- `head`: `Head()`
- `header`: 없음
- `afterBody`: `ConditionalRender(RecentNotes)` (index 제외) + `Comments` (giscus)
- `footer`: GitHub 링크

**defaultContentPageLayout (글 페이지):**
- `beforeBody`: Breadcrumbs, ArticleTitle, ContentMeta, TagList (조건부), TableOfContents (모바일)
- `left`: ProfileImage (데스크톱), PageTitle, Search, Darkmode, Explorer
- `right`: Graph (depth:2 데스크톱 / depth:1 모바일), TableOfContents, Backlinks, RecentNotes (index에서만)

**defaultListPageLayout (폴더·태그 목록):**
- `beforeBody`: Breadcrumbs (조건부), ArticleTitle, ContentMeta, TagList (조건부)
- `left`: ProfileImage, PageTitle, Search, Darkmode, Explorer
- `right`: 없음

**Explorer 정렬 기준:** 폴더 우선 → 파일은 날짜 내림차순 → 폴더는 이름순

---

## 5. 컴포넌트 목록 (`quartz/components/`)

<!-- AUTO-GENERATED: components-list START -->
| 파일 | 설명 |
|------|------|
| `ArticleTitle.tsx` | 글 제목 표시 |
| `Backlinks.tsx` | 역링크 목록 |
| `Body.tsx` | 본문 컨테이너 |
| `Breadcrumbs.tsx` | 경로 탐색 (빵 부스러기) |
| `Comments.tsx` | Giscus 댓글 (인터랙션 기반 lazy load) |
| `ConditionalRender.tsx` | ★ 커스텀: 조건부 컴포넌트 렌더링 래퍼 |
| `ContentMeta.tsx` | 글 메타 정보 (날짜, 읽기 시간 등) |
| `Darkmode.tsx` | 다크모드 토글 |
| `Date.tsx` | 날짜 포맷 |
| `DesktopOnly.tsx` | 데스크톱 전용 래퍼 |
| `Explorer.tsx` | 파일 탐색기 사이드바 |
| `Flex.tsx` | 플렉스 레이아웃 래퍼 |
| `Footer.tsx` | 푸터 |
| `Graph.tsx` | 그래프 뷰 |
| `Header.tsx` | 헤더 |
| `Head.tsx` | HTML <head> (SEO, 메타) |
| `MobileOnly.tsx` | 모바일 전용 래퍼 |
| `OverflowList.tsx` | 오버플로우 목록 |
| `PageList.tsx` | 페이지 목록 |
| `pages/404.tsx` | 404 페이지 |
| `pages/Content.tsx` | 콘텐츠 페이지 |
| `pages/FolderContent.tsx` | 폴더 목록 페이지 |
| `pages/TagContent.tsx` | 태그 목록 페이지 |
| `PageTitle.tsx` | 사이트 제목 |
| `ProfileImage.tsx` | ★ 커스텀: 프로필 사진 (/static/profile.png, 80px 원형) |
| `ReaderMode.tsx` | 리더 모드 |
| `RecentNotes.tsx` | 최근 글 목록 |
| `Search.tsx` | 전체 텍스트 검색 |
| `Spacer.tsx` | 공백 |
| `TableOfContents.tsx` | 목차 |
| `TagList.tsx` | 태그 목록 |

<!-- AUTO-GENERATED: components-list END -->

---

## 6. 플러그인 목록 (`quartz/plugins/`)

<!-- AUTO-GENERATED: plugins-list START -->
**Transformers:**
- `citations.ts`
- `description.ts`
- `frontmatter.ts`
- `gfm.ts`
- `lastmod.ts`
- `latex.ts`
- `linebreaks.ts`
- `links.ts`
- `ofm.ts`
- `oxhugofm.ts`
- `roam.ts`
- `syntax.ts`
- `toc.ts`

**Filters:**
- `draft.ts`
- `explicit.ts`

**Emitters:**
- `404.tsx`
- `aliases.ts`
- `assets.ts`
- `cname.ts`
- `componentResources.ts`
- `contentIndex.tsx`
- `contentPage.tsx`
- `favicon.ts`
- `folderPage.tsx`
- `ogImage.tsx`
- `static.ts`
- `tagPage.tsx`

<!-- AUTO-GENERATED: plugins-list END -->

---

## 7. 커스텀 수정 사항 (기본값에서 변경된 것들)

| 수정 내용 | 파일 |
|-----------|------|
| **ProfileImage 컴포넌트 추가** | `quartz/components/ProfileImage.tsx` |
| **ConditionalRender 컴포넌트 추가** | `quartz/components/ConditionalRender.tsx` |
| **Giscus 인터랙션 기반 lazy load** | `quartz/components/scripts/comments.inline.ts` — pointerdown/keydown/scroll 감지 후 로드 |
| **ExplicitPublish 필터** | `quartz/plugins/filters/explicit.ts` — `publish: true` 명시 글만 배포 |
| **Pretendard 폰트** | `styles/custom.scss` — CDN에서 로드 |
| **Explorer 날짜 내림차순 정렬** | `quartz.layout.ts` — 최신 글이 위에 표시 |
| **RecentNotes 커스텀 정렬** | `quartz.layout.ts` — `published` 날짜 기준 내림차순 |
| **ConditionalRender로 index 예외 처리** | `quartz.layout.ts` — index 페이지에서 일부 컴포넌트 숨김/표시 조건 분기 |

---

## 8. 배포 파이프라인

```
git push → branch: v4
    → .github/workflows/deploy.yml
        → actions/checkout@v4 (fetch-depth: 0, 전체 git 히스토리)
        → actions/setup-node@v4 (node 22, npm cache)
        → npm ci
        → npx quartz build → public/
        → actions/upload-pages-artifact@v3
        → actions/deploy-pages@v4
    → https://blog.omija-tea.work
```

- `concurrency: cancel-in-progress: true` — 연속 push 시 이전 빌드 자동 취소
- fetch-depth: 0 — git 히스토리 기반 날짜 정보 추출을 위해 전체 히스토리 필요

---

## 9. 콘텐츠 frontmatter 규칙

```yaml
---
title: "글 제목"
date: 2025-01-01        # 발행일 (published 날짜로 사용)
tags:
  - topic/카테고리
  - type/post
publish: true           # ★ 이게 true여야 배포됨 (ExplicitPublish 필터)
draft: false            # RecentNotes 필터에서 draft: true 글 제외
comments: false         # 댓글 비활성화 (선택)
---
```

- **publish** 필드가 없거나 `false`면 빌드에서 완전히 제외됨
- **태그**: `topic/*` (주제), `type/*` (글 유형) 체계 사용
- **날짜**: `defaultDateType: modified` 이지만 frontmatter 우선 (`priority: ["frontmatter", "filesystem"]`)

---

## 10. 로컬 개발

```bash
# 의존성 설치
npm ci

# 로컬 서버 실행 (hot-reload)
npx quartz build --serve

# 타입 체크 + 포맷 검사
npm run check

# 포맷 자동 수정
npm run format
```

빌드 결과는 `public/` 디렉터리에 생성됩니다 (.gitignore에 포함).

---

## 11. 컴포넌트/플러그인 수정 가이드

### 새 컴포넌트 추가 시
1. `quartz/components/MyComponent.tsx` 작성
2. `quartz/components/index.ts`에 export 추가
3. `quartz.layout.ts`에서 `Component.MyComponent()` 사용
4. (필요시) `quartz/components/styles/myComponent.scss` 추가

### 새 플러그인 추가 시
1. `quartz/plugins/{transformers|filters|emitters}/myPlugin.ts` 작성
2. `quartz/plugins/{...}/index.ts`에 export 추가
3. `quartz.config.ts`의 `plugins.{transformers|filters|emitters}` 배열에 추가

### 스타일 수정 시
- **전역 스타일**: `styles/custom.scss`
- **컴포넌트 스타일**: `quartz/components/styles/컴포넌트명.scss`
- **인라인 CSS**: 컴포넌트 TSX 안에 `Component.css = \`...\`` 형태로도 가능

---

## 12. 주의사항

- `content/_tags.md`, `content/index.md`의 `tags:` 배열은 **직접 편집 금지** (자동 관리)
- **파일 이동은 Obsidian UI에서** 수행 (wikilink 자동 갱신 때문)
- `content/temp/`의 글은 분류 전 임시 상태
- `publish: true` 없으면 빌드 자체에서 제외됨 (`ExplicitPublish` 필터)
- `.gitignore`에 `content/CLAUDE.md`, `content/.claude/`, `content/temp/`가 포함됨 (배포 제외)

---

## 13. 자동 갱신 안내

이 파일의 **섹션 5·6** (컴포넌트/플러그인 목록)은 `.claude/scripts/update-claude-md.sh` 스크립트로 자동 갱신됩니다.
`quartz/components/` 또는 `quartz/plugins/` 파일을 추가·수정하면 PostToolUse 훅이 이 스크립트를 실행합니다.
