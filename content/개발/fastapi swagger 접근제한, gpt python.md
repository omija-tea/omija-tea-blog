---
title: "fastapi swagger 접근제한, gpt python"
date: 2024-08-03 21:29
tags:
  - topic/fastapi
  - topic/python
  - topic/openai
  - type/note
publish: false
---
### fastapi swagger 접근제한
```python
app = FastAPI(
    title="server",
    description="omija server",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    root_path="/api",
)

class AdminPageAuth(HTTPBasic):
    pass


security = AdminPageAuth()


def get_admin(
    credentials: Annotated[HTTPBasicCredentials, Depends(security)],
    config: Annotated[Settings, Depends(get_settings)],
):
    correct_username = secrets.compare_digest(
        credentials.username,
        config.USERNAME,
    )  # type: ignore
    correct_password = secrets.compare_digest(
        credentials.password,
        config.PASSWORD
    )  # type: ignore
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect ID or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


@app.get("/swagger", tags=["docs"])
async def get_docs(username: str = Depends(get_admin)):
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


@app.get("/openapi.json", tags=["docs"])
async def openapi(username: str = Depends(get_admin)):
    return JSONResponse(
        content=get_openapi(title="docs", version="0.1.0", routes=app.routes)
    )


```
이렇게 해놓으면 맨 처음 swagger에 접근할때 아이디와 비밀번호를 요청할 수 있음.
### asyncopenai gpt
async 버전의 openai 패키지가 존재한다.
```python
from openai import AsyncOpenAI
client = AsyncOpenAI(api_key=config.API_KEY.OPENAI)

async def get_summary_from_post(post: str) -> list:
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={
            "type": "json_object",
        },
        messages=[
            {
                "role": "system",
                "content": """글을 문단별로 요약해줘. 제대로 안하면 회초리 때린다? 출력은 다음과 같은 json으로 해줘
                "summary" : [{"1" : "asdf"},{"2" :"fdsa"}]""",
            },
            {"role": "user", "content": post},
        ],
    )
    summary = response.choices[0].message.content
    summary_json = json.loads(summary)
    return summary_json.get("summary", [])

```
이렇게 해놓으면 나중에 aiohttp로 비동기식 무차별폭격 호출해도 잘 됨
