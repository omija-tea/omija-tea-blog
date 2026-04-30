---
title: obsidian으로 블로그 만들기(2) - quartz 설정
date: 2026-04-28 12:30
tags: []
publish: false
date created: 2026-04-28T12:30
date modified: 2026-04-22T16:17
---
# Quartz4
obsidian(마크다운)을 쉽게 블로그로 배포할 수 있게 해주는 정적 사이트 생성기이다.
[quartz4 공식 docs](https://quartz.jzhao.xyz/)를 참고하면 금방 시작할 수 있다.

# 개선
### 정적 파일, 게시물은 어떻게 넣나요? like robots.txt, GA 인증
quartz/static 이 아닌 quartz/quartz/static에 넣으면 됨
### favicon
quartz/quartz/static 안에 icon.png 라는 이름으로 넣으면 됨
### opengraph(meta tag)
![[IMG-20260430152318149.png]]
기본적으로 OgImage를 지원하는데, 한글이 깨지는 문제가 있음.
quartz/quartz/static/fonts 에 ttf폰트 넣어줘야됨. 저는 Pretendard 넣었습니다

### 탐색탭 날짜별로 정렬
탐색탭 기본정렬은 날짜별 정렬이 아니다. 날짜별 정렬이 깔끔하므로 구현해보자.
```typesc
```