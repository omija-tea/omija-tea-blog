---
title: temp 폴더 사용법
publish: false
tags:
  - type/note
---

> [!note] 임시 작업장
> 이 폴더는 **분류되지 않은 초고**가 머무는 공간입니다.
> 글을 쓸 때 폴더 고민 없이 일단 여기에 던져두면, Claude가 `/organize-temp` 호출 시 적절한 폴더로 이동시킵니다.

## 동작 흐름

1. Templater로 새 글 생성 → 일단 `temp/`에 저장
2. 본문 작성 (frontmatter는 templater가 채움)
3. Claude에게 정리 요청 (또는 `/organize-temp` 슬래시 커맨드)
4. Claude가 다음을 수행:
   - 본문 분석 → 적절한 카테고리 폴더 결정 (없으면 새로 생성)
   - 태그 보강 (기존 `topic/*` 우선, 필요 시 신규 태그 생성)
   - 신규 태그는 `tag-curator`가 정본 `blog/_tags.md`에 등록 후 `blog/index.md` `tags:`로 자동 동기
   - 관련 기존 글로의 `[[wikilink]]` 후보 제안

## 규칙

- 이 폴더의 글은 frontmatter에 `publish: false`가 기본 (임시 보호)
- 정리 후 폴더 이동 시점에 Claude가 `publish` 필드를 적절히 조정
- `_README.md`(이 파일)와 `_*.md` 패턴은 정리 대상에서 제외
