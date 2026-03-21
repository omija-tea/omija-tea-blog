---
base: "[[TIL.base]]"
태그: []
날짜: 2025-04-22
---
```bash
# rye 설치. 하라는대로 하면 됨
curl -sSf https://rye.astral.sh/get | bash
rye init --virtual mynotebook
cd mynotebook
rye add notebook
rye run jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser
```
위처럼 하면 접속 url 알려줌.
ec2 보안그룹에서 8888 열어주고 링크 ip 만 public으로 바꿔주면 바로 접속됨

## 이걸 왜함?
ec2에 파이썬을 설치하는게 아주 지랄맞기 때문. 요즘은 좀 나아졌나?