---
title: "AWS 문제 발생, 서버 버그 발생"
date: 2024-11-11 19:57
tags:
  - topic/aws
  - topic/infra
  - type/log
publish: true
---
서버에 버그가 나서 빨리 들어가서 확인해야하는데 aws security group에 문제가 발생함
![[IMG-20260321223745036.png]]
security group에 인바운드 규칙으로내 ip를 추가해서  빨리 들어가봐야되는데 AWS가 문을 안여는 문제 발생
급한대로 bastion 따라서 key 파일 복사 복사 복사 후 타고 들어가서 버그 핫픽스 배포