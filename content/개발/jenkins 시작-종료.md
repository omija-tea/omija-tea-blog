---
title: "jenkins 시작-종료"
date: 2024-03-25 21:01
tags:
  - topic/jenkins
  - topic/cicd
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
젠킨스는 restfulAPI를 통해 종료/재시작 등 가능.
serverurl/safeExit에 post요청을 날려서 서버 종료 가능.
이후 sudo service jenkins start, sudo systemctl start jenkins.service를 통해 재시작 가능

