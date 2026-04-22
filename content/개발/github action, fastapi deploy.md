---
title: "github action, fastapi deploy"
date: 2024-06-05 20:18
tags:
  - topic/fastapi
  - topic/docker
  - topic/cicd
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
```docker
FROM 3.10.13

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./src /code/src

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

```
재밌는 트릭을 사용한다. requirement만 copy하고 run해준다음 src를 copy해줌. 전체를 다 copy하지 않는 이유는 도커의 캐싱 기능을 효율적으로 쓰기 위해. requirements는 자주 바뀌지 않으므로

[https://seongjin.me/environment-variables-in-docker-compose/](https://seongjin.me/environment-variables-in-docker-compose/) 도커 컴포즈 환경변수