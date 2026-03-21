---
title: "pydantic alias with 상속 + fastapi"
date: 2025-05-19 14:11
tags:
  - topic/python
  - topic/pydantic
  - topic/fastapi
  - type/note
publish: true
---
```python
class MyModel(BaseModel):
    query: Annotated[str, Field(alias="query_alias")] = str(uuid.uuid4())
    rand: Annotated[float, Field(alias="rand_alias")]

    model_config = ConfigDict(validate_by_name=True)


class RealMyModel(MyModel):
    title: Annotated[str, Field(alias="title_alias")] = "search failed"

    model_config = ConfigDict(validate_by_name=True)

    @classmethod
    def from_default(cls):
        return cls(
            query="default_query",
            rand=0.1234,
            title="default_title",
        )


@app.post("/pydantic-test")
async def pydantic_test():
    model = RealMyModel.from_default()
    return model

```
fastapi 는 내부에 정의해둔 jsonable_encoder 라는 함수를 이용해서 pydantic model 을 json 으로 serialize 한 후 유저에게 반환함. 이 jsonable_encoder 의 기본 동작을 따라 올라가면 by_alias = True 로 serialize를 하는것을 알 수 있음. 요청을 받을때도 alias로 받는건 마찬가지.
보통 서버 내부 코드에서는 name으로 명명하는게 편하지 않나? name 을 snake case로 작성하고 alias 를 camel case로 작성하는게 일반적이니까… 그렇게 쓰기 위해서는 ConfigDict(validate_by_name) (기존의 populate_by_name) 을 사용하고 타입에서는 Annotated를 사용하는걸 추천. 그냥 Field 로 하면 mypy 가 잘 못잡고 no parameter named 경고를 발생시킴 .Annotated 를 사용하면 알아서 name 으로 추론됨
from_default(cls)를 사용하는건 주의해야됨. pydantic 2.11 이상에서만 되는것 같음. 어떤 업데이트 로그에서 가능하게 됐는지는 모르겠는데 2.8 에서는 안되더라.