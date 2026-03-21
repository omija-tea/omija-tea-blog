---
title: "SQLTools 사용해서 db 관리하기"
date: 2025-03-19 14:55
tags: []
publish: false
---
1. VSCode에서 SQLTools 설치
2. 사용하는 DB에 맞는 추가 extension 설치
3. 현재 ssh tunnel 기능은 PR 상태이므로 직접 native ssh tunnel을 사용해야함

```bash
Host my-server-tunnel
  HostName 123.123.123.123
  User ec2-user
  IdentityFile /Users/key.pem
  LocalForward 55432 database.asdf.region.rds.amazonaws.com:5432
```
4. 위와같은 형식으로 ssh configuration을 잡아줌

```bash
alias dbtunnel="ssh -N my-server-tunnel"
```
5. 위처럼 .zshrc에 alias 잡아서 편하게 쓰자
6. SQLTools에 DB connection 추가하기

![[IMG-20260321222022126.png]]
7. ssl 설정 안하면 no pg_hba.conf 에러가 발생함. 아래처럼 바꿔주자

![[IMG-20260321222022180.png]]
8. 터미널에서 dbtunnel 실행시키고 db 연결하면 됨