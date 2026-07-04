---
title: "FastAPI 한 endpoint에서 여러 형식 input 받기"
date: 2025-05-09 18:08
tags:
  - topic/fastapi
  - topic/python
  - topic/pydantic
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
```python

from app.util.tools import obfuscate_data
from pydantic import BaseModel, model_validator
from typing_extensions import Self


from abc import ABC, abstractmethod
from typing import Literal, Union


class RequestAddPostBase(BaseModel, ABC):
    type: Literal["ig", "nb"]

    @abstractmethod
    def to_key(self) -> str:
        """
        Convert request to key for DB
        """
        pass


class RequestAddNaverPost(RequestAddPostBase):
    type: Literal["nb"]
    post_id: str
    author_id: str

    @model_validator(mode="after")
    def validate_input(self) -> Self:
        if not self.post_id.isdigit():
            raise ValueError("post_id must be numeric")
        return self

    def to_key(self) -> str:
        return f"nb-{obfuscate_data(self.post_id + self.author_id)}"


class RequestAddInstagramPost(RequestAddPostBase):
    type: Literal["ig"]
    post_id: str

    @model_validator(mode="after")
    def validate_input(self) -> Self:
        if len(self.post_id) > 12:
            raise ValueError("Invalid post_id")
        return self

    def to_key(self) -> str:
        return f"ig-{self.post_id}"


RequestAddPost = Union[RequestAddInstagramPost, RequestAddNaverPost]






async def add_post(
    request: RequestAddPost = Body(..., discriminator="type"),
) -> GeneralResponse:
```
discriminator 를 사용하면 된다. type 에 맞게 알아서 request의 타입이 바뀜