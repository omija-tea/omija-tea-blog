---
title: "vpc attached lambda의 s3 접근"
date: 2025-02-11 16:31
tags:
  - topic/aws
  - topic/lambda
  - topic/s3
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
람다가 vpc private에서 돌아가도록 설정하면 s3에 접근 불가능함.
## 해결방법
1. VPC 탭에 들어간다
2. 왼쪽 컨텐츠들 중 endpoint 선택
3. s3 endpoint를 추가한다. 이때 gateway로 생성한다.
4. route table은 람다가 돌아가는 private로 설정
5. 전체 access로 설정
6. endpoint 생성
7. lambda설정으로 들어간다
8. lambda를 vpc에 attach 하고 private에서 돌아가도록 설정해놓는다
9. SG는 outbound all traffic으로 설정
10. 해결완료