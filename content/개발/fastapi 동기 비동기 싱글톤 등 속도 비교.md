---
title: "fastapi 동기 비동기 싱글톤 등 속도 비교"
date: 2025-04-09
tags: []
publish: false
---
## async 엔드포인트, 싱글톤 서비스, async 함수 호출
![[image 19.png]]
빠르다
## sync 엔드포인트, 싱글톤 서비스, sync 함수 호출
![[image 20.png]]
매우 느리다
## sync 엔드포인트, 일반 depends, sync 함수 호출
![[image 21.png]]
매우 느리다
## async 엔드포인트, 싱글톤 서비스, sync 함수 호출
![[image 22.png]]
최악으로 처참하다
이벤트 루프를 동기 함수가 틀어막아버려서 싹다 병목걸려버림

의외인점 : 동기로 하면 스레드 파서 해준다던데, 생각보다 느린듯?