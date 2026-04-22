---
title: "fastapi schema for fastapi"
date: 2024-06-10 21:48
tags:
  - topic/fastapi
  - topic/pydantic
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
```python
from pydantic import BaseModel, Field

class RequestToken(BaseModel):
    code: str = Field(
    title="Authorization Code", description="Google Authorization Code from client"
    )


class User(BaseModel):
    id: str = Field(title="User Id", description="User Id from google account(sub)")


class ResponseToken(BaseModel):
    userId: User
    isNewUser: bool = Field(
        title="New User Flag", description="Flag to check if the user is new or not"
    )
    token: str = Field(
        default="test token", title="Token", description="token of app"
    )
```
controller 단에서 가져다가 쓰면 된다.