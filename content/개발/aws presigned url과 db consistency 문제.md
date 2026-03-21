---
title: "aws presigned url과 db consistency 문제"
date: 2024-12-18 19:06
tags:
  - topic/aws
  - topic/s3
  - topic/database
  - type/note
publish: false
---
만약 유저가 파일 업로드하는데에 실패했더라도 db에는 key가 들어가있는 문제 발생.
client 사이드에서 업로드가 완료된 이후에 백엔드에 confirm 요청을 날리거나 s3에 event notification → lambda를 이용하는 방법이 있을것.