---
title: "sqlalchemy session for fastapi"
date: 2024-07-31 14:54
tags:
  - topic/sqlalchemy
  - topic/fastapi
  - topic/async
  - type/note
publish: false
---
sessionmiddleware.py
```python
from uuid import uuid4

from starlette.types import ASGIApp, Receive, Scope, Send
from app.core.database.session import (
    reset_session_context,
    set_session_context,
)


class SQLSessionMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        session_id = str(uuid4())
        db_session_token = set_session_context(session_id=session_id)

        try:
            await self.app(scope, receive, send)
        except Exception as exception:
            raise exception
        finally:
            reset_session_context(db_session_token)
```
맨 처음 클라이언트가 들어올때, 클라이언트마다 session_context를 할당. async_scoped_session은 해당 session_context를 기반으로 이벤트루프마다 생성됨

session.py
```python
import functools
from contextvars import ContextVar, Token
import traceback
from typing import Awaitable, Callable, ParamSpec, TypeVar
import logfire
from sqlalchemy.exc import IntegrityError

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_scoped_session,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings
from app.core.exceptions import CustomBaseCommitException, IntegrityErrorException

session_context: ContextVar[str] = ContextVar("session_context")


def get_session_context() -> str:
    return session_context.get()


def set_session_context(session_id: str) -> Token:
    return session_context.set(session_id)


def reset_session_context(context: Token) -> None:
    session_context.reset(context)


config = get_settings()
engine = create_async_engine(
    "{DB_URL}://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(
        DB_URL="postgresql+asyncpg",
        DB_USER=config.POSTGRES_USER,
        DB_PASSWORD=config.POSTGRES_PASSWORD,
        DB_HOST=config.DB_HOST,
        DB_PORT=config.DB_PORT,
        DB_NAME=config.POSTGRES_DB,
    ),
    echo=True if config.IS_TEST else False,
    pool_recycle=3600,
)
logfire.instrument_sqlalchemy(engine=engine.sync_engine)

session_factory = async_sessionmaker(
    bind=engine, expire_on_commit=False, class_=AsyncSession
)
session = async_scoped_session(
    session_factory=session_factory, scopefunc=get_session_context
)


async def dispose_engine():
    await engine.dispose()


async def get_session():
    try:
        yield session
    finally:
        await session.close()
        await session.remove()


T = TypeVar("T")
P = ParamSpec("P")


def transactional(func: Callable[P, Awaitable[T]]) -> Callable[P, Awaitable[T]]:
    @functools.wraps(func)
    async def _wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        try:
            result = await func(*args, **kwargs)
            await session.commit()
        except IntegrityError as e:
            await session.rollback()
            print(traceback.format_exc())
            raise IntegrityErrorException() from e
        except CustomBaseCommitException as e:
            await session.commit()
            print(traceback.format_exc())
            raise e
        except Exception as e:
            await session.rollback()
            print(traceback.format_exc())
            raise e
        return result

    return _wrapper


```
솔직히 좋은 구현이라고 볼 수는 없을것같다. 
다만 session이 async_scoped_session이라 짜피 단일스레드의 여러개의 이벤트루프에서도 구분된 session을 가질 수 있으므로 요래 구현해놨음.