---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2025-03-24
---
```bash
events {
    worker_connections 1024;
}
http {
    upstream backend {
        server 10.0.3.192;
        server 10.0.8.122;
    }

    upstream naver_backend {
        server 10.0.3.192 max_fails=2 fail_timeout=300s;
        server 10.0.8.122 max_fails=2 fail_timeout=300s;
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
503이 오면 그쪽으로 보내는 요청 한동안 막아둘 수 있음