---
title: "git filter-repo, alembic altertable, parser 아키텍처"
date: 2024-09-29 21:24
tags: []
publish: false
---
작성자를 잘못 작성하고 있었다. gh auth등을 통해 권한을 가져오는건 맞는데, 실제로 깃허브에 푸시가 올라가는 유저의 정보는 git config를 통해서 깃허브가 유추하는것. 근데 playjnj@khu.ac.kr이 아닌 playjnj123@gmail.com으로 config가 설정되어 있어 모든 커밋이 이상한 유저에게 가고있엇음
## 해결방법
1. git filter-repo 설치
2. 깨끗한 상태로 클론 받아오기
3. mailmap 파일 작성

```plain text
omija-tea <playjnj@khu.ac.kr> <playjnj123@gmail.com>
```
4. git filter-repo --force --mailmap .mailmap
5. git remote add origin [https://githu](https://githu/)….
6. git push --force origin main
7. git push —force origin beta …

![[IMG-20260321223220858.png]]
사라진 커밋 복구 완료

### alter table postgresql using 문제
서로 상호변경이 쉽지않은 type이 있음 ex : uuid ↔ str
이때는 using clause를 사용해주어야함. ex) using supabase_sub::uuid
alembic 0.8.8부터는 지원함
```python
    op.alter_column('user', 'supabase_sub',
               existing_type=sa.VARCHAR(),
               type_=sa.Uuid(),
               postgresql_using='supabase_sub::uuid',
               existing_nullable=True)

```
postgresql_using 을 추가해주면 됨. 사실 다 안되면 걍 op.execute하면됨

### jwt 토큰에서 데이터를 뽑아오는 구조
jwt 토큰에서 데이터를 뽑아와야한다. username, picture, sub등 다양한 데이터를 가져와야함. 각각을 가져오는 함수를 전부 DI로 만들어도 되지만 가독성과 관리 용이성을 위해 supabasetokenhandler 라는 유저의 jwt를 di받는 클래스를 만들어서 관리.