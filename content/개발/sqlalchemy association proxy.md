---
title: "sqlalchemy association proxy"
date: 2024-08-04 19:22
tags:
  - topic/sqlalchemy
  - topic/python
  - type/note
publish: false
---
유저와 post가 다대다 관계인데, 유저가 먼저 생성되고 post가 추가되는 방식이라고 생각하자.
```python
class User(CreatedMixin, Base):
    __tablename__ = "user"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), default=uuid.uuid4, primary_key=True
    )
    username: Mapped[str] = mapped_column(index=True, unique=True)

    userpostlinks: Mapped[list["UserPostLink"]] = Relationship(  # noqa: F821 # type: ignore
        back_populates="user"
    )
    posts: AssociationProxy[list["Post"]] = association_proxy(  # noqa: F821 # type: ignore
        "userpostlinks", "post", creator=lambda post_obj: UserPostLink(post=post_obj)
    )


class Post(CreatedMixin, Base):
    __tablename__ = "post"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), default=uuid.uuid4, primary_key=True
    )
    title: Mapped[str]
    description: Mapped[str]
    status: Mapped[str] = mapped_column(index=True)

    userpostlinks: Mapped[list["UserPostLink"]] = Relationship(  # noqa: F821 # type: ignore
        back_populates="post"
    )
    users: AssociationProxy[list["User"]] = association_proxy(  # noqa: F821 # type: ignore
        "userpostlinks", "user"
    )

class UserPostLink(Base, CreatedMixin):
    __tablename__ = "userpostlink"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"), primary_key=True)
    post_id: Mapped[str] = mapped_column(ForeignKey("post.id"), primary_key=True)
    user: Mapped["User"] = Relationship(back_populates="userpostlinks")  # type: ignore # noqa: F821
    post: Mapped["Post"] = Relationship(back_populates="userpostlinks")  # type: ignore # noqa: F821

```
이런식으로 해두면 user에서 userpostlink를 거치지 않고 바로 post로 갈 수 있음.
또한 orm 방식을 사용해서 user에다 post를 추가할때, creator를 설정해두었기 때문에 userpostlink를 통해 생성됨.
User의 posts를 잘 보면 userpostlink의 post를 향해 프록시를 설정한다는 것.

나중에 ide(mypy)의 도움을 받기 위해서는 타입을 명확히 해줘야하는데, 무턱대고 import를 해버리면 circular import때문에 문제가된다.
먼저 큰 따옴표 안에 가둬두고 아래와 같은 코드를 추가해주자
```python
if TYPE_CHECKING:
    from app.model.relationships import UserPostLink
    from app.model.post import Post
from app.model.relationships import UserPostLink
```
UserPostLink는 creator에 사용되기 때문에 직접 import 했음.
type_checking은 typing 모듈에서 지원하는데,  이친구는 runtime에는 false임. mypy를 돌릴때만 true가 되기때문에 ide의 도움을 받을 수 있다.
