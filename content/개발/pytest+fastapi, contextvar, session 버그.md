---
title: "pytest+fastapi, contextvar, session 버그"
date: 2024-08-28
tags: []
publish: false
---
pytest에서 dependency injection 관련 depends mocking이 안되는 문제 발생
이거 fastapi app 단에서 depends를 resolve 해주는거라 내가 따로 unittest를 작성하면 depends가 제대로 작동을 안한다.
→ pytest fixture를 사용해서 미리 depends할 애들을 만들어주고, override하는 방법을 사용하기로 결정
내부적으로 db에서 async_scoped_session을 사용하기 때문에 scope_func로 uuid4 형태의 contextvar를 사용하고 있었음.
근데 fixture에서 제대로 설정돼도 실제 테스트 pytest.mark.asyncio가 시작되면 contextvar가 설정이 풀려있는 문제가 발생
[https://github.com/pytest-dev/pytest-asyncio/issues/127](https://github.com/pytest-dev/pytest-asyncio/issues/127)
→ 알고보니 파이썬 3.10에서는 pytest asyncio가 독립적인 task로 실행돼서 context를 잃어버린다고 한다.
→ contextvar를 만들때 쓰는 uuid만 fixture로 고정하고 그때그때 테스트에서 contextvar를 새로 만들어주는 방법으로 해결

pytest debug로 돌릴때 결과만 나오는거 → test  results 말고 debug console을 보면 된다. extension 깔려 있어서 자동으로 됨
```python

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
def config() -> Generator[Settings, None, None]:
    config = get_settings()
    yield config

@pytest.fixture(scope="session")
def context_session_id():
    context_session_id = str(uuid4())
    context_token = set_session_context(context_session_id)
    yield context_session_id
    reset_session_context(context_token)

@pytest.fixture(scope="function")
async def db_session(context_session_id):
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
        pool_recycle=3600,
    )
    set_session_context(context_session_id)
    session_factory=async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)
    db_session = async_scoped_session(
        session_factory=session_factory, scopefunc=get_session_context
    )
    yield db_session
    await db_session.close()
    await db_session.remove()
    await engine.dispose()


async def user_service(db_session: AsyncSession, config: Settings, context_session_id: str) -> AsyncGenerator[UserService, Any]:
    user_repository = UserRepository(session=db_session)
    config = config
    yield UserService(user_repository, config)

@pytest.mark.asyncio
@sessionmanager
async def test_get_user_name(user_service, context_session_id):
    username = await user_service.get_user_name("8a42b8cf-63fe-4f0e-b8ce-78bb2da93c18")
    assert username == "nj_jeong"

```
이렇게 해서 해결 완료
### session bug
transactional 데코레이터에서 session을 닫으면 제대로 풀에 반환이 안되는 문제가 있었던 것 같음. 명시적으로 yield session을 한 곳에서 닫아주는거 추가.
