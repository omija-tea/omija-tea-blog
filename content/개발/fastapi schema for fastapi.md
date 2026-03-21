---
base: "[[TIL.base]]"
태그: []
날짜: 2024-06-10
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