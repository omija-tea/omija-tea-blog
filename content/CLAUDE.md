# Blog 폴더 운영 매뉴얼

이 파일은 vault 루트 `CLAUDE.md`를 **블로그 영역에 한정해 보완**합니다.
중복되는 frontmatter 표준, 태그 체계, 보안 체크리스트는 vault CLAUDE.md를 참조하세요.

## 배포 환경

- 작성: Obsidian + Templater (Templater가 `title`, `date`, `tags`, `publish` 자동 생성)
- 배포: Quartz4 → GitHub Pages (이 폴더는 Quartz4 vault에 심볼릭 링크됨)
- 배포 제외: frontmatter `publish: false` 또는 `temp/` 폴더 위치

## 폴더 지도

| 폴더 | 주제 | 신규 글 분류 기준 |
|------|------|-------------------|
| `temp/` | 미분류 초고 | 작성 직후 임시 저장. `/organize-temp`로 이동 |
| `개발/` | 개발 전반 (백엔드·인프라·DB·도구·모바일·아키텍처) | 코드/시스템/툴 관련 학습·트러블슈팅 |
| `블로그 구축/` | 블로그 자체 구축 시리즈 (Obsidian, Quartz, 배포) | "obsidian으로 블로그 만들기(N)" 시리즈 |
| `Attachment/` | 이미지·첨부 | 본문에서 참조하는 자산 |
| `테스트 폴더/` | 테스트용 (운영 무시) | — |
| `_tags.md` | 태그 카탈로그 정본 (publish: false) | 글 아님. `tag-curator`가 관리 |
| `index.md` | 블로그 홈 (Quartz 빌드 진입점) | `tags:` 배열은 `_tags.md`에서 자동 생성 |

> **분류 원칙**: 위 폴더로 분류되지 않는 글이 들어오면 **새 카테고리 폴더를 생성**하고, 이 표에 한 줄 추가합니다. 임의로 `개발/` 하위에 묻지 말 것.

### `개발/` 폴더 세부 (현 90+ 노트)

`개발/`은 현재 평면 구조이며, 다음 테마가 혼재합니다 (분할은 사용자 요청 시에만):

- **백엔드**: FastAPI, Flask, SQLAlchemy, Pydantic, Alembic, Pytest
- **DB**: PostgreSQL/PostGIS, MySQL, full-text search, NLP
- **인프라/AWS**: EC2, RDS, Lambda, S3, IAM, ECR, Route53
- **컨테이너/CI**: Docker, docker-compose, Jenkins, GitHub Actions
- **네트워크**: Nginx, Cloudflare, DNS, HTTPS, OAuth, CORS
- **도구**: PyCharm, IntelliJ, VSCode, Git, 터미널
- **모바일**: Flutter, iOS, Android
- **아키텍처/메타**: Layered Architecture, DDD, AI 도구 사용기

## 핵심 워크플로

### 1. 임시 글 정리 (`/organize-temp`)

```
temp/*.md (단, _*.md 제외) 발견
→ 본문 + frontmatter 읽고 주제 판단
→ 추천 폴더 제시 (없으면 신규 폴더 신설 제안 — 직접 만들지 않음)
→ 태그 보강 (in-place); 신규 태그 시 tag-curator가 _tags.md → index.md 자동 동기
→ 관련 기존 글로의 wikilink 후보 제안
→ publish 필드 점검 (기본 true, 민감 내용 발견 시 false 권고)
→ 사용자에게 Obsidian UI에서 이동 요청 (wikilink 자동 갱신 활용)
→ 이동 완료 알림 받으면 폴더 지도(이 파일) 갱신
```

> **왜 자동 이동을 하지 않는가**: 노트 간 `[[wikilink]]`가 존재할 경우 OS 레벨 `mv`는 링크 경로를 갱신하지 않아 글망이 깨질 수 있다. Obsidian은 파일 이동 시 자동으로 모든 backlink를 새 경로로 다시 쓰므로 (Settings → Files & Links → Automatically update internal links), 이동은 반드시 Obsidian 내부에서 수행한다.

### 2. 태그 정합성 검사 (`/tag-audit`)

```
모든 .md 파일 스캔 → 사용된 topic/* type/* 태그 집합 추출
→ 정본 _tags.md와 diff
→ 누락 태그는 _tags.md에 자동 추가 (적절한 카테고리)
→ index.md tags 배열을 _tags.md에서 단방향 재생성
→ 어디서도 안 쓰이는 고아 태그 보고 (제거는 사용자 확인 후)
```

> **태그는 Claude가 단독 관리**. 사용자는 직접 _tags.md나 index.md `tags:`를 편집하지 않습니다. 모든 갱신은 `tag-curator` 스킬을 거칩니다.

### 3. 새 글 작성 (`/new-post`)

Templater가 frontmatter를 채우므로, Claude는 **본문 골격**과 **분류·태그 추천**에 집중합니다.

## 자동화 불변식 (Invariants)

작업 후 항상 다음을 만족시키세요:

1. **태그 카탈로그 일관성**: 사용 중인 모든 `topic/*`·`type/*` 태그는 정본 `blog/_tags.md`에 존재해야 하며, `blog/index.md`의 `tags` 배열은 `_tags.md`에서 단방향 재생성된 결과여야 함 (직접 편집 금지)
2. **폴더 지도 최신성**: 사용자가 신규 폴더를 만들고 이동을 완료한 시점에 이 파일의 폴더 지도 표를 즉시 갱신
3. **temp 폴더 청정성 (목표)**: 정리 흐름이 끝나면 `temp/`에 `_README.md`만 남는 것이 이상적 (실제 이동은 사용자 손)
4. **publish 안전성**: `publish: true` 글에는 vault CLAUDE.md의 보안 체크리스트(실명 회사·도메인·credential)를 통과한 내용만 포함
5. **파일 시스템 변경 금지**: Claude는 `mv`/폴더 생성/`Move-Item`/`New-Item -ItemType Directory` 등 파일·폴더 구조 변경 명령을 직접 실행하지 않는다. **frontmatter나 본문 in-place 편집만 허용.** 구조 변경은 사용자가 Obsidian UI에서 수행 (wikilink 자동 갱신을 위해).

## 발전 규칙

이 파일과 `.claude/` 하위 자산은 **고정 자산이 아니라 살아있는 매뉴얼**입니다.
새로운 패턴(자주 묻는 분류 결정, 새 폴더 카테고리, 태그 명명 규칙 등)을 발견하면 해당 파일·SKILL을 즉시 갱신하세요.
