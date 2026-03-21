---
title: "pygraphviz, erdantic"
date: 2025-01-05
tags: []
publish: false
---
맥에서 설치할때 오류 발생함. 디렉토리 못찾아서 발생하는 문제
```python
 brew install graphviz

 export PATH=$(brew --prefix graphviz):$PATH
 export CFLAGS="-I $(brew --prefix graphviz)/include"
 export LDFLAGS="-L $(brew --prefix graphviz)/lib"

rye tools install pygraphviz
rye tools install erdantic
 
```
그러고나서
```python
import erdantic as erd
from app.schema import post

diagram = erd.EntityRelationshipDiagram()

diagram.add_model(post.StatusCount)
diagram.add_model(post.RequestReportPost)
diagram.add_model(post.ResponseGroupCount)
diagram.add_model(post.ResponsePost)
diagram.add_model(post.ResponsePostWithBookmarked)
diagram.add_model(post.ResponseAdminPost)
diagram.add_model(post.ResponseAdminReportedPost)
diagram.add_model(post.ResponsePostDetail)
diagram.add_model(post.ResponseAdminPostDetail)
diagram.add_model(post.ResponseUserPost)
diagram.add_model(post.ResponseSearchedPost)
diagram.add_model(post.ResponsePagenatedUserPost)
diagram.add_model(post.ResponsePagenatedAdminPost)
diagram.add_model(post.ResponsePagenatedAdminReportedPost)
diagram.add_model(post.ResponsePostRelatedUserPlace)
diagram.add_model(post.ResponseRecommendedPost)
diagram.add_model(post.ResponseRecommendedPostList)
diagram.add_model(post.ResponsePostDetailWithUserRelatedInfo)


diagram.draw("diagram.png")


```
이런식으로 하면 다이어그램 그려짐