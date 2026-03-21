---
title: "google oauth2, fastapi cors"
date: 2024-06-08 20:18
tags:
  - topic/oauth
  - topic/fastapi
  - topic/cors
  - type/note
publish: true
---
### google oauth2 with fastapi
```python
async def __get_user_info_from_google_token(
    request: RequestToken,
) -> UserInfoWithID:
    request_body = {
        "code": request.code,
        "client_id": os.environ.get("GCP_CLIENT_ID"),
        "client_secret": os.environ.get("GCP_CLIENT_SECRET"),
        "redirect_uri": os.environ.get("GCP_REDIRECT_URI"),
        "grant_type": "authorization_code",
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://oauth2.googleapis.com/token", data=request_body
        ) as response:
            tokens = await response.json()
    if "error" in tokens:
        raise HTTPException(status_code=400, detail=tokens)
    if "id_token" not in tokens:
        raise HTTPException(status_code=400, detail="unknown error occured")
    id_info = verify_oauth2_token(
        id_token=tokens["id_token"],
        request=google_requests.Request(),
        audience=os.getenv("GCP_CLIENT_ID"),
    )
    id_info["id"] = id_info["sub"]
    return UserInfoWithID(**id_info)

```
우리팀의 플로우는 front에서 code를 받아서 백엔드로 던지고 백엔드에서 code를 교환하는 방식을 사용.
그래서 일반적인 oauth2 플로우는 적용시키는데 오히려 복잡하다고 판단했고, 직접 요청하는걸 구현하기로 함.
요래요래 해주면 구글 oauth 성공~
### fastapi cors
```python
origins = [
    "https://frontend.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)

```
