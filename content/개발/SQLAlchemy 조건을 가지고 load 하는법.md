---
title: "SQLAlchemy 조건을 가지고 load 하는법"
date: 2025-04-02
tags: []
publish: false
---
join + contains_eager / joinedload 를 사용하는것도 좋지만 distinct 등 귀찮게 중복 문제를 해결해야함.
SQLAlchemy1.4? 부터 도입된 with_loader_criteria 와 subquery 를 이용하면 쉽게 조건부 load 가능
```python
    async def get_with_place_and_user_review_score(
        self, post_id: str, user_id: uuid.UUID
    ) -> Post | None:
        place_image_subquery = (
            select(PlaceImage.id)
            .where(PlaceImage.place_id == Place.id)
            .order_by(PlaceImage.created_at.desc())
            .limit(5)
            .correlate(Place)
        )

        query = (
            select(Post)
            .options(
                selectinload(Post.postplacelinks)
                .selectinload(PostPlaceLink.place)
                .options(
                    selectinload(Place.place_reviews),
                    selectinload(Place.place_images),
                ),
                with_loader_criteria(
                    PlaceImage, lambda cls: cls.id.in_(place_image_subquery)
                ),
                with_loader_criteria(
                    PlaceReview,
                    lambda cls: and_(cls.place_id == Place.id, cls.user_id == user_id),
                ),
            )
            .where(Post.id == post_id)
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
```
조건을 달아서 조건에 해당하는 애들만 load 하는게 가능해진다.