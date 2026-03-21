---
title: "sqlalchemy loaded 상태 확인"
date: 2025-02-14 20:24
tags:
  - topic/sqlalchemy
  - topic/python
  - type/note
publish: false
---
relationship을 사용하고 있을때, 특정 attributer가 load 된 상태인지 확인해야하는 경우가 있다.
특정 경우를 처리하는 함수를 만드는데, 로딩이 안되어있는 상태에서 요청한다면 튕군다던가 하는 경우?
```dart
from sqlalchemy.orm.attributes import instance_state

    def upsert_fcm_token(self, token: str, device_id: str):
        if "fcm_tokens" in instance_state(self).unloaded:
            raise ExceptionAttributeNotLoaded("fcm_tokens")
```
instance_state.unloaded를 호출하면 아직 load 되지 않은 attribute들의 set을 반환한다.
여기에 확인하고자 하는 attribute가 없는지 체크하면 완료