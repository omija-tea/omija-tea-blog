---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2024-08-02
---
### mac
> brew install postgis로 설치

### window
> stack builder 에 spatial extensions가 존재. 거기서 postgis설치

### rds
> 기본으로 깔려있던것으로 기억
[PostGIS 확장을 사용하여 공간 데이터 관리 - Amazon Relational Database Service](https://docs.aws.amazon.com/ko_kr/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.PostGIS.html)
여기 참조할것

### 공통
> create database mydb;
create extension postgis;
로 설정 완료