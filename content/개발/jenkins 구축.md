---
title: "jenkins 구축"
date: 2024-03-04 19:11
tags: []
publish: false
---
jenkins를 공부하고있다.
jenkins에서 sh 명령어같은걸 수행하면 누가 수행시켜주나 확인해봤는데, 내 raspberry pi 운영체제에 jenkins라는 이름의 사용자가 추가되고 그 사용자가 명령어를 수행시키는 방식인것 같다.
jenkins관리의 system을 들어가니까 홈 디렉토리(var/lib/jenkins)가 나온다.
> [!note]+ 사진
> ![[Untitled 20.png]]

내 깃헙에 sh_test레포지토리 만들고 test.sh(echo hello) 파일을 넣어뒀다.
위에처럼 설정하고 아래 execute shell에서 sh test.sh하니까 동작 성공

본격적인 테스트 시작. ronnya git으로 땡겨오고 docker compose up 명령어 수행시키도록 만들었는데 jenkins가 docker 그룹에 속하지 않아서 
```shell
sudo usermod -a -G docker jenkins
newgrp docker
```
수행. permission 부여