---
title: "pycharm ruff intergration"
date: 2025-09-27 17:17
tags:
  - topic/python
  - topic/pycharm
  - type/note
publish: false
---
ruff pycharm 지원이 좀 구리다는 생각이 든다.
ruff-lsp는 deprecate 되었기에 ruff server를 사용해야함. 다행히 pycharm-ruff-plugin이 이걸 지원
rye tools install ruff 하고
pycharm-ruff-plugin 설치하면
알아서 global 툴로 찾아줌
이후 pyproject.toml에서 설정 잡아주고
action on save 들어가서 formatting 해주면
알아서 저장할때 formatting 되고, formatting 할때 ruff를 자동으로 사용함

테스트해볼라면 줄 길이 제한 늘였다 줄였다 하면서 해보면 됨
