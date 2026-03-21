---
title: "sqlalchemy, alembic server_default, docker volume dump"
date: 2024-09-04 19:04
tags: []
publish: false
---
default : sqlalchemy 단에서 default값을 관리해줌
server_default : db 단에서 default 값을 관리해줌.
created_at은 server_default date.now로 넣었고, user의 register_token은 secrets.token_urlsafe(32) 로 default로 넣음.

alembic에서 default로 할때 기존에 존재하던 row들에 대해서 값을 적용해주는 방법
```python
    op.add_column('user', sa.Column('register_token', sa.String(), nullable=True))
    op.add_column('user', sa.Column('supabase_sub', sa.String(), nullable=True))
    op.create_unique_constraint(None, 'user', ['supabase_sub'])
    op.create_unique_constraint(None, 'user', ['register_token'])
     # Get a connection and a session
    bind = op.get_bind()
    session = Session(bind=bind)

    # Iterate through existing rows and update the register_token
    users = session.execute(sa.text('''SELECT id FROM "user"''')).fetchall()
    for user in users:
        token = get_random_token()
        session.execute(
            sa.text('''UPDATE "user" SET register_token = :token WHERE id = :id'''),
            {'token': token, 'id': user.id}
        )

    # Commit the session to apply the changes
    session.commit()
    # ### end Alembic commands ###

```
## postgresql 볼륨 restore
docker exec -i postgres pg_restore -U postgres -d mydb /dump.sql