---
base: "[[TIL.base]]"
태그: []
날짜: 2024-06-05
---
rye를 쓰자


```docker
FROM python:3.10.13-slim

WORKDIR /app
COPY requirements.lock ./
RUN PYTHONDONTWRITEBYTECODE=1 pip install --no-cache-dir -r requirements.lock

COPY src .
CMD python main.py

```