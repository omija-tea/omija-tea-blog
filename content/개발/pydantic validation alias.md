---
title: "pydantic validation alias"
date: 2025-06-26 21:31
tags:
  - topic/python
  - topic/pydantic
  - type/note
publish: false
---
```python
class ResponseCollection(BaseModel):
    collection_uuid: uuid.UUID = Field(
        alias="id",
        validation_alias="collection_uuid",
        serialization_alias="id",
    )
    name: str
    permission: UserCollectionPermissionType = "admin"
    palette: CollectionPaletteType
    post_count: int = 0
    place_count: int = 0
    is_saved: bool = False
    is_default: bool = False

    model_config = ConfigDict(validate_by_name=True, serialize_by_alias=True)
```
validation 할때 (ResponseCollection.model_validate or ResponseCollection(**SchemaCollection)) 할때는 validation_alias 를 쓰고 serialize 할때는 serialization_alias 를 쓰게 설정 가능