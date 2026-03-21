---
title: "postgresql full text search"
date: 2024-09-26
tags: []
publish: false
---
to_tsvector을 이용해서 텍스트를 벡터로 만들어놓고, 나중에 검색할때 사용.
rds에서는 to_tsvector(’simple’) 이 먹는데 로컬 postgres app에서는 안먹는 문제 발생(mac)
따로 컨테이너 만들었음.