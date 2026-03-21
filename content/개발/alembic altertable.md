---
title: "alembic alter column - using clause"
date: 2024-09-29T21:25:00
tags:
  - topic/alembic
  - topic/postgresql
  - type/note
publish: true
---
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