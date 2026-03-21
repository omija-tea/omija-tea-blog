---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2025-04-21
---
postgresql 에서 아래 명령어 실행해보자
```bash
SHOW timezone;
```
나는 Asia/Seoul 이 나옴

이 경우 utc 의 시간을 넣어주면 (timestamp without time zone) 나중에 조회할때 알아서 kst로 보여줌 (+0900) 이때 timestamptz 타입을 사용해야함