---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2024-08-01
---
```python
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class RequestWebhook(BaseModel):
    url: str
    user_id: int

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
```
프론트와 맞추기 위해 alias를 generate하되, 내부에서는 pythonic하게 호출해야하므로 populate_by_name 플래그 설정

## alembic migration
base.py
```python
from app.core.database.model import Base, CreatedMixin  # noqa: F401
from app.model.relationships import UserPostLink, PostPlaceLink  # noqa: F401
from app.model.user import User  # noqa: F401
from app.model.post import Post  # noqa: F401
from app.model.place import Place  # noqa: F401
from app.model.category import Category  # noqa: F401
```
이렇게 한곳에 다 뭉쳐놓으면
```python
from app.core.database.model import Base
from app.core.database import base  # noqa: E402, F401

target_metadata = Base.metadata

```
env.py를 이렇게만 만들어놔도 알아서 추적해서 migration 만들어줌
```python
config = context.config
settings = get_settings()
if not config.get_main_option("sqlalchemy.url"):
    config.set_main_option(
        "sqlalchemy.url",
        "{DB_URL}://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(
            DB_URL="postgresql",
            DB_USER=settings.POSTGRES_USER,
            DB_PASSWORD=settings.POSTGRES_PASSWORD,
            DB_HOST=settings.DB_HOST,
            DB_PORT=settings.DB_PORT,
            DB_NAME=settings.POSTGRES_DB,
        ),
    )

```
다만 sqlalchemy.url은 동적으로 해야 나중에 확장성도 좋고 관리도 편하기에 script.py.mako에서 sqlalchemy.url부분을 지우고 env.py에서 동적으로 만들어줬음

### migration 생성
```python
alembic revision --autogenerate -m "메시지"
```
### 업그레이드
```python
alembic upgrade head
```
### 다운그레이드
```python
alembic downgrade -1
혹은 alembic downgrade {migration hash}
```