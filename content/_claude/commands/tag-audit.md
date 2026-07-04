---
description: 블로그 전체 태그 정합성 검사 및 카탈로그 동기화
---

`scripts/tag-sync.py`를 실행해 태그를 점검하세요.

## 검사 + 자동 수정

```bash
python 'C:/Users/SSAFY/Documents/Obsidian Vault/scripts/tag-sync.py'
```

- 사용 중인데 `_tags.md`에 없는 태그 → "기타" 섹션에 자동 등록
- `_tags.md` → `blog/index.md` tags 배열 단방향 재생성
- 변경 없으면 무출력

## 검사만 (수정 안함)

```bash
python 'C:/Users/SSAFY/Documents/Obsidian Vault/scripts/tag-sync.py' --dry
```

## 결과 해석

| 출력 | 의미 |
|------|------|
| `[OK] _tags.md 신규 등록: topic/X` | 누락 태그 자동 추가됨 — `_tags.md` "기타" 섹션에서 설명 보완 필요 |
| `[OK] index.md tags 재생성` | index.md가 갱신됨 |
| `WARN 고아 태그: topic/Y` | 정본엔 있는데 어느 글에서도 안 쓰임 — 삭제 여부 확인 필요 |
| (아무 출력 없음) | 모두 정합함 |

## 고아 태그 정리

자동 삭제는 하지 않음. 고아로 보고된 태그를 삭제하려면:
- `blog/_tags.md`에서 해당 행을 직접 삭제 (Obsidian 편집)
- 이후 hook이 `index.md`를 자동 재생성

## 자동 등록된 태그 카테고리 보완

`type/test`, `topic/crawling` 같이 자동으로 "기타"에 들어간 태그는:
- `_tags.md`에서 올바른 카테고리 섹션으로 이동하고 설명 작성
- 또는 잘못된 태그면 해당 글 frontmatter에서 제거 후 _tags.md 행 삭제
