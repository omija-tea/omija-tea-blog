---
title: SQLAlchemy 쿼리 플랜 출력
date: 2025-01-03 16:01
tags:
  - topic/sqlalchemy
  - topic/postgresql
  - type/note
publish: true
date created: 2026-03-21T23:45
date modified: 2026-04-22T16:17
---
```python
# ! 디버그용 쿼리 플랜 출력 코드
@event.listens_for(Engine, "before_cursor_execute")
def explain_before_cursor_execute(
    conn, cursor, statement, parameters, context, executemany
):
    if statement.strip().lower().startswith("select"):  # SELECT 쿼리만 대상
        explain_stmt = f"EXPLAIN (ANALYZE, VERBOSE) {statement}"
        cursor.execute(explain_stmt, parameters)
        plan = cursor.fetchall()  # 쿼리 플랜 가져오기
        print("\033[91m--------------------[Query Alert]--------------------\033[0m")
        print("\033[91m[ALERT] Query:\033[0m")
        print(statement)  # 쿼리 출력
        print("\033[91m[ALERT] Query Plan:\033[0m")
        print("\n".join(row[0] for row in plan))  # 쿼리 플랜 출력


# ! 디버그용 쿼리 플랜 출력 코드
```
간단하게 모든 DB쿼링에 대한 쿼리와 쿼리플랜을 출력 가능

기본적으로 many to many 테이블에서 관계테이블을 만들면 인덱스는 복합으로 걸림
복합은 뒤에나온애를 key로 쓰면 인덱스를 안탐. 뒤에껄로 조회해야되는 경우가 잦으면 인덱스 만들어줘야됨
## 페이지네이션 포스트 조회
### 기존
Seq Scan on public.userpostlink  (cost=0.02..372.63 rows=13 width=39) (actual time=0.063..1.810 rows=27 loops=1)
Output: post_id, user_id, created_at
Filter: ((userpostlink.post_id)::text = ANY ('{ig-123,ig-C9zl-aIPdh-,ig-123,ig-123,ig-123,ig-123,ig-123,ig-123,ig-C-123}'::text[]))
Rows Removed by Filter: 14954
Planning Time: 0.053 ms
Execution Time: 1.815 ms
### post_id에 index
Bitmap Heap Scan on public.userpostlink  (cost=39.91..82.73 rows=29 width=39) (actual time=1.379..2.355 rows=54 loops=1)
Output: post_id, user_id, created_at
Recheck Cond: ((userpostlink.post_id)::text = ANY ('{ig-123,ig-123,ig-C-h-123,ig-C-123,ig-C-123,ig-C-123,ig-123,ig-123,ig-123,ig-123,ig-123,ig-C7-123,ig-123,ig-123,ig-C-123,ig-123,ig-C9--123,ig-123,ig-123,ig-123}'::text[]))
Heap Blocks: exact=26
->  Bitmap Index Scan on ix_userpostlink_post_id  (cost=0.00..39.85 rows=29 width=0) (actual time=1.355..1.355 rows=54 loops=1)
Index Cond: ((userpostlink.post_id)::text = ANY ('{ig-123,ig-123,ig-C-h-123,ig-C-123,ig-C-123,ig-C-123,ig-123,ig-123,ig-123,ig-123,ig-123,ig-C7-123,ig-123,ig-123,ig-C-123,ig-123,ig-C9--123,ig-123,ig-123,ig-123}'::text[]))
Planning Time: 0.158 ms
Execution Time: 2.384 ms
## 단독 post 조회
### 기존
[ALERT] Query:
SELECT userpostlink.post_id AS userpostlink_post_id, userpostlink.user_id AS userpostlink_user_id, userpostlink.created_at AS userpostlink_created_at
FROM userpostlink
WHERE userpostlink.post_id IN ($1::VARCHAR)
[ALERT] Query Plan:
Index Scan using userpostlink_pkey on public.userpostlink  (cost=0.29..317.60 rows=1 width=39) (actual time=0.246..0.840 rows=3 loops=1)
Output: post_id, user_id, created_at
Index Cond: ((userpostlink.post_id)::text = 'ig-123'::text)
Planning Time: 0.082 ms
Execution Time: 0.855 ms
### post_id에 index
[ALERT] Query:
SELECT userpostlink.post_id AS userpostlink_post_id, userpostlink.user_id AS userpostlink_user_id, userpostlink.created_at AS userpostlink_created_at
FROM userpostlink
WHERE userpostlink.post_id IN ($1::VARCHAR)
[ALERT] Query Plan:
Index Scan using ix_userpostlink_post_id on public.userpostlink  (cost=0.29..4.30 rows=1 width=39) (actual time=0.141..0.309 rows=3 loops=1)
Output: post_id, user_id, created_at
Index Cond: ((userpostlink.post_id)::text = 'ig-123'::text)
Planning Time: 0.270 ms
Execution Time: 0.381 ms

cost가 매우 줄어들음