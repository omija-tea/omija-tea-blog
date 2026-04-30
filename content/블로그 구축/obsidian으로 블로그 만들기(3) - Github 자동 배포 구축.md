---
title: obsidian으로 블로그 만들기(3) - 자동 배포 구축
date: 2026-04-30 15:36
tags: []
publish: false
date modified: 2026-04-30T15:36
data created: 2026-04-30T15:35
---
CD를 구축해보자.

### 지금까지 우리가 한것
1. 라즈베리파이를 WebDAV 서버로 하여 동기화 시스템 구축
2. quartz 설정 했음
이제 배포만 해두면 바로 볼 수 있다!

## 준비물
1. 도메인
2. 라즈베리파이(이미 충족)
3. github 계정

# Github Action을 씁시다
1. Github에 repo하나 만들고, 해당 repo를 remote로 등록
2. .github/workflows에 deploy.yml을 작성
```yaml

```