---
title: "rye"
date: 2024-06-05 16:20
tags:
  - topic/python
  - topic/docker
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
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