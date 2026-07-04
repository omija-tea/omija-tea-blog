---
title: "timezone"
date: 2025-04-21 17:04
tags:
  - topic/postgresql
  - topic/database
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
postgresql 에서 아래 명령어 실행해보자
```bash
SHOW timezone;
```
나는 Asia/Seoul 이 나옴

이 경우 utc 의 시간을 넣어주면 (timestamp without time zone) 나중에 조회할때 알아서 kst로 보여줌 (+0900) 이때 timestamptz 타입을 사용해야함