---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2025-01-09
---
최상위 conftest.py
```python
@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_context_session_id():
    context_session_id = str(uuid4())
    context_token = set_session_context(context_session_id)
    yield context_session_id
    reset_session_context(context_token)


@pytest.fixture(
    scope="session", autouse=True
)  # 아직 참조되는곳이 없어도 반드시 실행되도록
async def test_db_session(test_context_session_id):
    test_config = get_settings()
    engine = create_async_engine(
        "{DB_URL}://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(
            DB_URL="postgresql+asyncpg",
            DB_USER=test_config.POSTGRES_USER,
            DB_PASSWORD=test_config.POSTGRES_PASSWORD,
            DB_HOST=test_config.DB_HOST,
            DB_PORT=test_config.DB_PORT,
            DB_NAME=test_config.POSTGRES_DB,
        ),
        echo=True,
        pool_recycle=3600,
    )
    test_db_session_token = set_session_context(test_context_session_id)
    session_factory = async_sessionmaker(
        bind=engine, expire_on_commit=False, class_=AsyncSession
    )
    database_session = async_scoped_session(
        session_factory=session_factory, scopefunc=get_session_context
    )
    await initialize_test_data(database_session)
    yield database_session
    await database_session.close()
    await database_session.remove()
    reset_session_context(test_db_session_token)
    await engine.dispose()

```
initialize_test_data
```python
from app.core.database import Base
from app.model import base  # noqa: F401
from .user import users
from .category import categories


async def initialize_test_data(session):
    for table in reversed(Base.metadata.sorted_tables):
        await session.execute(table.delete())
    await session.commit()
    for user in users:
        session.add(user)
    for category in categories:
        session.add(category)
    print(hex(id(session)))

    await session.commit()
```
위처럼 구성해서 초기데이터를 아예 처음부터 넣어주도록 구성

혹은 테스트 환경 구성용 test_db_session을 만들어 두었으니, 나중에 test 코드에서 받아다가 직접 넣어도 상관은 없음

# 발생했던 문제
## test_db_session을 fastapi app이 끌고 들어가서 사용해버리는 문제
인터넷에서 코드를 그대로 쓰면 안되는 이유
app.dependency_override로 get_session 함수를 override해버리는 방식을 보고 따라서 구현했었다.
그러다보니 test환경의 session을 그대로 끌고 들어가서 실제 router 테스트 과정에서 갖다 써버리는 문제가 발생.
test환경의 세션과 AsyncClient환경의 세션이 다르다보니 session_context도 달라지고, 그러다보니 commit이 수행되지 않음.
세션을 발행받은곳은 test 환경인데 AsyncClient환경에서 세션을 닫아버리려고 시도하는 등 꼬여버림
### 해결
테스트환경에서의 db세션과 AsyncClient 환경에서의 db세션을 분리. 
나는 귀찮아서 test용  환경변수 파일을 따로 만들어서 사용하고있지만, 혹시 환경변수를 override해서 사용하려고 하는 사람이 있다면 AsyncClient환경의 세션을 만들고 app.dependency_override를 통해 get_session 함수를 테스트 환경에서 fastapi app 용으로 따로 발행한 db session으로 오버라이드 해버리는 방법도 가능할 듯 하다

## 
