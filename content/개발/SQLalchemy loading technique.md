---
title: SQLalchemy loading technique
date: 2024-10-26 13:11
tags:
  - topic/sqlalchemy
  - topic/python
  - type/note
publish: false
---
N:1 에서는 joinedload가 좋고 N:M에서는 selectinload가 좋다고 하나…. 머리쓰기 귀찮으니까 그냥 전부다 selectinload를 쓰도록 하자. 가장 최신형의 방법으로, 쿼리를 쪼개서 날린다.
```python
query = select(Place).options(selectinload(Place.category_rel), selectinload(Place.postplacelinks).selectinload(PostPlaceLink.post)).where(Place.naver_place_id == None).where(Place.status == True).limit(3)
```
Place.category_rel과 postplacelink는 직접적인 관계는 업으니 체인으로 연결하지 않고 따로따로 로드.
postplacelink, post는 체인으로 연결해서 전부 불러오면 됨. 그러면 N+1 문제 해결~