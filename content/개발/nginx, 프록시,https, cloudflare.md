---
title: "vim 기본 설정"
date: 2024-06-15 14:49
tags:
  - topic/nginx
  - topic/cloudflare
  - topic/https
  - type/note
publish: false
---
# vim 기본 설정
```bash
set clipboard=unnamedplus
set nu
set autoindent
set ts=4
set sts=4
set mouse=a
set scrolloff=2
set hlsearch
set laststatus=2
set smartcase
set smarttab
set smartindent
set ruler
```
# cloudflare, nginx, https
nginx로 한참 씨름했다. 처음부터 쭉 정리해보자
1. ec2 인스턴스를 생성한다(test 용으로 public)
2. ec2 보안그룹에서 인바운드를 80, 443  대상으로 열어준다
3. cloudflare에서 Full(strict)로 해준다. 
    1. 이게 중요하다. Full(strict)로 하면 유저-cloudflare도 보안 연결이 되고 cloudflare-서버 도 보안연결(https)를 하게 되는데 이 과정에서 strict까지 적용하게 되면 무조건 cloudflare가 CA로 존재하는 인증서만 허용하게 된다. 
4. certificate파일과 key 파일을 서버로 옮겨준다
5. 도커 서버를 8000으로 띄워준다
6. nginx.conf 설정을 잡아준다
    2. upstream을 localhost:8000으로 잡아줌. nginx-fastapi는 http로 통신하기때문에 상관 X 내부에
    3. 80을 듣는 server를 설정해준다. server_name은 우리가 사용하는 domainㅇ로 설정하면 되고 308을 이용해서 443으로 redirect 해준다. 301이 아니라 308인 이유는 이게 가끔 post, put도 get으로 바꿔버리기 때문이라고 한다
    4. 443을 듣는 server를 설정해준다. 여기에 ssl_certificate를 붙여주고 proxy_pass로 [http://upstreamservername](http://upstreamservername/) 을 잡아준다. proxy_set_header는 Host를 $host로 던져준다
7. 이러고 외부에서 우리의 도메인으로 https 접속을 하면 nginx의 server443으로 들어가고, 해당 요청을 fastapi로 프록시 패스 해주고 이는 localhost:8000으로 들어가게 됨

[https://hyeon9mak.github.io/nginx-upstream-multi-server/](https://hyeon9mak.github.io/nginx-upstream-multi-server/)
```bash
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    upstream fastapi {
        server localhost:8000;
    }
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.

    server {
        listen       80;
        server_name  api.server.app;
        return 308 https://$host$request_uri;
        }


    server {
        listen       443 ssl;
        server_name  api.server.app;

        ssl_certificate "/etc/cloudflare_cert/cert.pem";
        ssl_certificate_key "/etc/cloudflare_cert/key.pem";

        location / {
            proxy_pass http://fastapi;
            proxy_set_header Host $host;
        }
    }
}
```
난 기본파일 이렇게 했음
