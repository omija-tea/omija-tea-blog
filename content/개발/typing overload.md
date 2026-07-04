---
title: "typing overload"
date: 2025-05-13 21:50
tags:
  - topic/python
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
```python
    @overload
    async def get_by_primary_key_load_collection(
        self, user_id: uuid.UUID, nullable: Literal[True]
    ) -> User | None: ...
    @overload
    async def get_by_primary_key_load_collection(
        self, user_id: uuid.UUID, nullable: Literal[False]
    ) -> User: ...
    async def get_by_primary_key_load_collection(
        self, user_id: uuid.UUID, nullable: bool = True
    ) -> User | None:
        user = await self.get_one_or_none_by(
            "id",
            user_id,
            load_=[[User.user_collection_links, UserCollectionLink.collection]],
        )
        if not nullable and not user:
            raise NoUserException()
        return user
```
인자에 따라 반환 타입을 다르게 추론하도록 만들어 줄 수있음.