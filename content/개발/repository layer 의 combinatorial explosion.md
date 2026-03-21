---
title: "쿼리 스펙을 객체로 표현"
date: 2025-06-05 17:59
tags:
  - topic/architecture
  - topic/sqlalchemy
  - type/note
publish: true
---
현재는 도메인 중심으로 repository를 설계하고 있음.
```python
class PlaceRepository(ABC):
    @abstractmethod
    def find_for_gallery_display(self, place_id: int) -> Optional[Place]:
        pass
    
    @abstractmethod  
    def find_for_detail_page(self, place_id: int) -> Optional[Place]:
        pass
```
사실은 도메인 중심도 아니고 service로 repository의 최적화 로직이 유출되고 있는 상황이지만…(load 할거 선택)
도메인 방향으로 고친다고 가정하더라도 도메인이 많아질수록 조합이 폭발하듯 많아지는 문제가 발생함.

어떻게 해결할까?
1. Query Object 패턴을 사용해서 Repository에 쿼리 자체를 전달한다

```python
# 쿼리 스펙을 객체로 표현
@dataclass
class PlaceQuery:
    place_id: int
    include_images: bool = False
    include_reviews: bool = False
    include_tags: bool = False
    
    @classmethod
    def for_gallery(cls, place_id: int) -> 'PlaceQuery':
        return cls(place_id=place_id, include_images=True)
    
    @classmethod
    def for_detail_page(cls, place_id: int) -> 'PlaceQuery':
        return cls(
            place_id=place_id, 
            include_images=True, 
            include_reviews=True,
            include_tags=True
        )
    
    @classmethod
    def for_basic(cls, place_id: int) -> 'PlaceQuery':
        return cls(place_id=place_id)

# Repository는 하나의 메서드만
class PlaceRepository(ABC):
    @abstractmethod
    def find(self, query: PlaceQuery) -> Optional[Place]:
        pass

# SQLAlchemy 구현체
class SQLAlchemyPlaceRepository(PlaceRepository):
    def find(self, query: PlaceQuery) -> Optional[Place]:
        stmt = select(Place).where(Place.id == query.place_id)
        
        # 쿼리 객체에 따라 동적으로 로딩 옵션 적용
        options = []
        if query.include_images:
            options.append(selectinload(Place.images))
        if query.include_reviews:
            options.append(selectinload(Place.reviews))
        if query.include_tags:
            options.append(selectinload(Place.tags))
            
        if options:
            stmt = stmt.options(*options)
            
        return self.session.execute(stmt).scalar_one_or_none()

# Service에서 사용
class PlaceService:
    def get_place_for_gallery(self, place_id: int):
        query = PlaceQuery.for_gallery(place_id)
        return self.place_repository.find(query)
    
    def get_place_for_detail(self, place_id: int):
        query = PlaceQuery.for_detail_page(place_id)
        return self.place_repository.find(query)
```
이런식으로
2. CQRS 패턴을 사용한다

command용과 query용을 분리해서 사용하는건데… 아직까지 우리 서비스에 이정도까지 하는건 오버킬 같다