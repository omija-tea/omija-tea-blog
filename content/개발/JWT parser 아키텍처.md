---
title: JWT parser 아키텍처
date: 2024-09-29T21:26:00
tags:
  - topic/fastapi
  - topic/architecture
  - topic/auth
  - type/note
publish: false
---
jwt 토큰에서 데이터를 뽑아와야한다. username, picture, sub등 다양한 데이터를 가져와야함. 각각을 가져오는 함수를 전부 DI로 만들어도 되지만 가독성과 관리 용이성을 위해 supabasetokenhandler 라는 유저의 jwt를 di받는 클래스를 만들어서 관리.