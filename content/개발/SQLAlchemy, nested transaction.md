---
title: "Nested Transaction in SQLAlchemy"
date: 2025-01-06
tags: []
publish: false
---
# Nested Transaction in SQLAlchemy
```python
def transactional(func: Callable[P, Awaitable[T]]) -> Callable[P, Awaitable[T]]:
    @functools.wraps(func)
    async def _wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        try:
            result = await func(*args, **kwargs)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
        return result

    return _wrapper


def transactional_nested(func: Callable[P, Awaitable[T]]) -> Callable[P, Awaitable[T]]:
    @functools.wraps(func)
    async def _wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        try:
            savepoint = await session.begin_nested()
            result = await func(*args, **kwargs)
            await savepoint.commit()
        except Exception as e:
            await savepoint.rollback()
            raise e
        return result

    return _wrapper
```
요래요래 하면 nested transaction이 된다.
```python
    @transactional
    async def create_user_post_share(self, user_uuid: uuid.UUID, post_id: str) -> bool:        new_post = Post(
            id="transaction_test",
            source_type="trt",
            description="transaction_test",
            status="in_queue",
        )
        await self.post_repository.add(new_post)
        try:
            await self.user_post_share_service.create_user_post_share(
                user_uuid, post_id
            )
        except Exception as e:
            print(e)
        return True



    @transactional_nested
    async def create_user_post_share(self, user_uuid: uuid.UUID, post_id: str) -> bool:
        user_post_share = UserPostShare(user_id=user_uuid, post_id=post_id)
        await self.user_post_share_repository.create_user_post_share(user_post_share)
        raise Exception()
        return True


```
created_user_post_share에서 에러가 나서 rollback이 되더라도 outer transaction은 그대로 유지됨
이는 savepoint를 활용하기에 가능한것.

다만 savepoint.commit을 한다고 해서 실제로 db에 commit되는건 아님. release savepoint되는것. savepoint를 삭제하되, 전체 트랜잭션은 아직 진행되는중
# 비동기? 상태 추적?
게시글 분석하고 추가하는 부분을 비동기로 아예 뚝 떼버릴까 상태추적 형식으로 계속 DB에 commit하면서 할까?
어차피 확장할 필요도 없고 (외부 API의존이 많은거지 CPU bound하지는 않음) 유저에게 알리기 위한게 목적이라면 단지 DB에 commit하면서 상태 추척하게 할 수 만 있으면 똑같이 구현 가능.
비동기는 또 만드는데 시간 디지게 오래 걸리기 때문에 그냥 상태추적하자
