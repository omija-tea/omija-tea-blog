# CLAUDE.md — omija-tea 블로그 (Quartz 5)

정남준(omija-tea)의 개인 블로그. **Quartz 5** 기반. 배포: GitHub Pages → `blog.omija-tea.work`.
Obsidian으로 글을 쓰고 `content/`에 동기화 → 빌드/배포.

> 2026-07 v4 → v5 마이그레이션 완료. v4 브랜치는 보존(`git checkout v4`). 이 브랜치는 `v5`.

## Quartz 5 핵심 구조 (v4와 완전히 다름)

- **설정**: `quartz.config.yaml` (v4의 `quartz.config.ts` + `quartz.layout.ts`를 대체). TS 아님.
- **플러그인**: 코어 내장이 아니라 **git 패키지**(`github:quartz-community/*`) 또는 **로컬 경로**(`./plugins/*`).
  - `quartz.config.yaml`의 `plugins:` 배열에서 `enabled` / `options` / `order` / `layout` 지정.
  - 설치: `npx quartz plugin install --from-config` → `.quartz/plugins/`에 clone(원격) 또는 **symlink**(로컬). 인덱스(`.quartz/plugins/index.ts`) 자동 생성. `.quartz/`는 gitignore.
  - **빌드 전 반드시 plugin install** (Head.tsx가 생성된 인덱스를 정적 import). CI도 별도 스텝.
- **레이아웃**: 플러그인별 `layout: { position(left|right|beforeBody|afterBody), priority, display(all|mobile-only|desktop-only), condition(예: not-index), group }`. 전역 `layout.groups`(flex), `layout.byPageType`(페이지 타입별 오버라이드).
- **frontmatter 파서**: v5엔 별도 코어 파서 없음. **`note-properties` 플러그인이 `---` YAML을 파싱**해 `vfile.data.frontmatter`를 채움 → **반드시 enabled**(order 5). 끄면 발행 필터/날짜/제목 전부 깨짐. 프로퍼티 표는 `hidePropertiesView: true`로 숨김.
- **URL**: v5는 모든 슬러그를 **소문자화 + 공백→하이픈** 정규화(한글은 유지). v4 대비 URL 다수 변경됨(SEO 새로 시작).

## 커스텀 로컬 플러그인 (`plugins/`)

빌드 파이프라인 없이 **순수 ESM JS**로 작성(로컬 플러그인은 symlink만 되고 빌드 안 됨). preact는 저장소 루트 `node_modules`에서 해석됨.

- `plugins/fonts-cdn/` — Pretendard + IBM Plex Mono 웹폰트를 head `<link>`로 주입(transformer의 `externalResources`). v4 `custom.scss @import` 대체(번들 CSS의 `@import 최상단` 제약 회피).
- `plugins/profile-image/` — 좌측 사이드바 프로필 사진(80px 원형, 데스크톱 전용). 이미지: `quartz/static/profile.png`.
- `plugins/comments-lazy/` — giscus 댓글. **사용자 인터랙션(스크롤/클릭/키/터치) 전까지 iframe 로딩 지연**(v4 커스텀). 스톡 `comments` 컨테이너를 복제하고 `afterDOMLoaded`만 교체. 스톡 `github:quartz-community/comments`는 disabled.

각 로컬 플러그인 = `package.json`(`quartz` manifest: category/components/…) + `index.js`(manifest 재노출) + (컴포넌트면) `components/index.js`. 컴포넌트는 `QuartzComponentConstructor` = `(opts) => (props) => vnode`, `.css` / `.afterDOMLoaded` 지원.

## 전역 커스텀 CSS

`quartz/styles/custom.scss` — 모바일 사이드바 flex 튜닝 등. (폰트는 위 fonts-cdn 플러그인에서 처리.)

## 콘텐츠 규칙

- **발행**: frontmatter `publish: true` 인 글만 배포(`explicit-publish` 플러그인). 없으면 배제.
- `content/_claude/`, `content/CLAUDE.md`, `content/temp/` 등 운영 파일은 `ignorePatterns`로 제외.

## 자주 쓰는 명령

```bash
npx quartz plugin install --from-config   # 플러그인 설치/심링크/인덱스 생성 (빌드 전 필수)
npx quartz build                          # public/ 로 정적 빌드
npx quartz build --serve                  # 로컬 프리뷰
```

## 배포

- `.github/workflows/deploy.yml` — GitHub Pages. **현재 수동 실행(workflow_dispatch)만**. v5 검증 후 `push: [v5]` 주석 해제 시 라이브(blog.omija-tea.work) 전환. CNAME은 `cname` 플러그인이 생성.

## 재현 완료 (v4 → v5)

- 폰트(Pretendard/IBM Plex Mono), 프로필 사진, giscus 인터랙션 lazy-load → 로컬 플러그인.
- index 우측 RecentNotes(limit 10) / 모바일 TOC → 동일 플러그인 2번째 인스턴스(`source: {repo, name}` + `condition: index`).
- Explorer hover 효과 + indent 가이드색 → `custom.scss`. (v5 explorer는 모바일 토글·데스크톱 접기 버튼 내장.)
- recent-notes 헤더 → ko-KR i18n "최근 게시글"(옵션 없음, v4 "최근 작성한 글"과 사실상 동일).

## 아직 남은 항목 (TODO)

- **Explorer 날짜 내림차순 정렬**: contentIndex.json이 클라이언트에 `date`를 노출하지 않음 → `content-index` fork로 date 필드 추가 필요. (현재 v5 기본: 폴더우선+알파벳)
- **og-image(소셜 이미지)**: Satori가 테마 폰트(Pretendard=비구글)를 googleapis에서 못 받아 실패 → Pretendard TTF 번들 + og-image fork 필요. 현재 `enabled: false`.
- **태그 페이지에서 index 글 제외**: index.md에 topic 태그 다수 → 태그페이지에 노출. vault의 `index.md`에서 태그 제거하거나 `tag-page` fork.
- Explorer 틱 표시(미세 장식) — DOM 의존, 생략.
