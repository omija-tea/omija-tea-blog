---
title: "sqlalchemy mixin, config"
date: 2024-07-30
tags: []
publish: false
---
```python
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    declarative_base,
)  # DeclarativeBase는 abstract가 잘 안먹어서 구버전으로 대체

my_metadata = sa.MetaData()

declarative_base = declarative_base(metadata=my_metadata)


class Base(declarative_base):
    __abstract__ = True
    metadata = my_metadata


class CreatedMixin(object):
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime(timezone=True),
        server_default=sa.func.now(),
    )


```
CreatedMixin 만들고 나중에 모델 선언할때 mix해주면 자동으로 해당 column 만들어줌

pydantic_setting을 이용해서 환경변수 관리
```python
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Slack(BaseSettings):
    SLACK_HOOK: str


class Incoming(BaseSettings):
    A: str
    B: str


class Outgoing(BaseSettings):
    SLACK: Slack


class Webhook(BaseSettings):
    INCOMING: Incoming
    OUTGOING: Outgoing


class ApiKey(BaseSettings):
    OPENAI: str


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_nested_delimiter="__")

    API_KEY: ApiKey
    WEBHOOK: Webhook
    DB_HOST: str
    DB_PORT: str


@lru_cache()
def get_settings():
    return Settings()  # type: ignore


```
이제 환경변수 파일에
API_KEY__OPENAI = ~
WEBHOOK__INCOMING__A = ~ 
이런식으로 입력하면 
env_nested_delimiter = 던더로 뒀기에 알아서 인식해서 설정해줌