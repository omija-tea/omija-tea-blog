---
title: git filter-repo
date: 2024-09-29 21:24
tags:
  - topic/git
  - topic/alembic
  - type/note
publish: true
date created: 2026-03-21T23:47
date modified: 2026-04-22T16:17
---
작성자를 잘못 작성하고 있었다. gh auth등을 통해 권한을 가져오는건 맞는데, 실제로 깃허브에 푸시가 올라가는 유저의 정보는 git config를 통해서 깃허브가 유추하는것. 근데 학교 이메일이 아닌 개인 gmail로 config가 설정되어 있어 모든 커밋이 이상한 유저에게 가고있었음
## 해결방법
1. git filter-repo 설치
2. 깨끗한 상태로 클론 받아오기
3. mailmap 파일 작성

```plain text
my-github-id <my-school-email@khu.ac.kr> <my-gmail@gmail.com>
```
4. git filter-repo --force --mailmap .mailmap
5. git remote add origin [https://githu](https://githu/)….
6. git push --force origin main
7. git push —force origin beta …

![[IMG-20260321234700705.png]]
사라진 커밋 복구 완료