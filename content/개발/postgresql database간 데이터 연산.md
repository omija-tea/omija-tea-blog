---
title: "postgresql database간 데이터 연산"
date: 2025-05-21 19:21
tags:
  - topic/postgresql
  - topic/database
  - type/note
publish: true
---
RDS 에서 production, test 두개의 database가 굴러가고 있다.
production 에 있는 데이터를 test로 옮기되, 그대로 dump 하는게 아니라 복잡한 조건을 거친 후 조건에 맞는 애들만 update 해줘야 하는 상황 발생.
세가지 정도 방법이 떠올랐다.
1. dump 뜬 다음에 dump된 데이터 바탕으로 임시 테이블 만들고 sql문 조작
2. sqlalchemy를 이용한 간단한 python script를 작성하고 코드로 해결
3. dblink 이용

dblink를 이용하면 외부에 있는 DB A에서 select를 하고 해당 데이터를 DB B에서 야무지게 쓸 수 있다.
그래서 postgresql extension dblink를 사용함
```sql
WITH candidate_updates AS (
    SELECT
        t.ctid AS target_ctid,
        s.naver_place_id,
        ROW_NUMBER() OVER (PARTITION BY s.naver_place_id ORDER BY t.ctid) AS rn
    FROM place t
    JOIN (
        SELECT p.location, p.place_name, p.naver_place_id
        FROM dblink(
            'dbname=production user=user password=password',
            'SELECT location, place_name, naver_place_id FROM place WHERE status = true'
        ) AS p(
            location public.geography,
            place_name varchar,
            naver_place_id varchar
        )
    ) s
      ON ST_DWithin(t.location, s.location, 0.1)
     AND t.place_name = s.place_name
     AND t.naver_place_id IS DISTINCT FROM s.naver_place_id
     AND NOT EXISTS (
         SELECT 1 FROM place p2 WHERE p2.naver_place_id = s.naver_place_id
     )
    WHERE t.status = true
)
UPDATE place t
SET naver_place_id = cu.naver_place_id
FROM candidate_updates cu
WHERE t.ctid = cu.target_ctid
  AND cu.rn = 1;
```
요래 하면 된다. 끗