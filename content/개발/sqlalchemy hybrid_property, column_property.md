---
title: "sqlalchemy hybrid_property, column_property"
date: 2025-01-01 11:50
tags:
  - topic/sqlalchemy
  - topic/python
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
모든 post 객체에 대해서 DB에는 저장하지 않되 항상 계산해야하는 field가 있다.
우리프로젝트의 경우에는 user_link_count가 이에 해당함.
이럴때, sqlalchemy 단에서 이걸 해내는 방법이 있다.
[SQL Expressions as Mapped Attributes
 —
    SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/orm/mapped_sql_expr.html#using-column-deferral-with-column-property)
두가지가 있음. hybrid_property, column_property
hybrid_property는 python수준, sql수준에서 둘다 작동하는 편하고 유연한 방식,
column_property는 load될때 같이 된다는 장점이 있다고 한다.


