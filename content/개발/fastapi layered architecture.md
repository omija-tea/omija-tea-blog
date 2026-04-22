---
title: "fastapi layered architecture"
date: 2024-06-09 17:11
tags:
  - topic/fastapi
  - topic/architecture
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
architecture 없이 fastapi 공식 guide 스타일로 마구잡이 개발하다가 refactoring과 테스팅이 매우 어려워졌다.
controller - service - repository의 layered architecture을 적용해보자.
controller에서는 service를 DI 받아서 사용하고, service에서는 repository를 DI받아서 사용한다.
