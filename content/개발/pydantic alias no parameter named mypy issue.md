---
title: pydantic alias no parameter named mypy issue
date: 2025-05-19 20:29
tags:
  - topic/python
  - topic/pydantic
  - type/note
publish: true
---
[Present Field Name Rather Than Alias When Using Intellisense · Issue #5893 · pydantic/pydantic](https://github.com/pydantic/pydantic/issues/5893#issuecomment-2512807073)

```python
from pydantic import BaseModel
class A(BaseModel):
	my_value_one: int = Field(alias = 'myValueOne")

myA = A(my_value_one = 3) 
```
# 이거 오류 발생함. mypy 단에서 제대로 잡지를 못해서 no parameter named 발생(동작은 정상적으로 됨)
```python
from pydantic import BaseModel
from typing import Annotated
class A(BaseModel):
	my_value_one: Annotated[int, Field(alias = 'myValueOne")]

myA = A(my_value_one = 3) 
```
요래 하면 no parameter named 발생 안함