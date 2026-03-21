---
title: "nginx를 통한 LB 2"
date: 
tags: []
publish: false
---
```python
events {
    worker_connections 1024;
}
http {
    upstream backend {
        server 172.31.6.164;
        server 172.31.4.197;
        server 172.31.7.2;
        server 172.31.10.45;
        server 172.31.5.153;
    }

    upstream naver_backend {
        server 172.31.6.164 max_fails=2 fail_timeout=300s;
        server 172.31.4.197 max_fails=2 fail_timeout=300s;
        server 172.31.7.2 max_fails=2 fail_timeout=300s;
        server 172.31.10.45 max_fails=2 fail_timeout=300s;
        server 172.31.5.153 max_fails=2 fail_timeout=300s;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504 non_idempotent;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /crawl/sns {
            proxy_pass http://backend;
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504 non_idempotent;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /crawl/naver/place {
            proxy_pass http://naver_backend;
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504 non_idempotent;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```
post 요청을 할때는 non_idempotent를 적어야 다른 서버로 재요청을 한다.
crawl/naver에서 서버가 실패했다면 nginx는 해당 서버 자체를 잠깐 다운시킴.
다운시키는 시간은 fail_timeout 이고 N번 실패해야 서버가 다운된걸로 파악하는가? 는 max_fails임. 각각의 기본값은 10s와 1회. 즉 한번만 서버에서 500, 502, 503, 504를 보내도 그 서버는 죽은걸로 nginx가 파악을 해버린다.
그러면 /crawl/naver가 실패했을때 /crawl/sns에 영향을 미치는 사태가 발생해버림
그래서 location을 쪼갰다.