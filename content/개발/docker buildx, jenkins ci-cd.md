---
title: "docker buildx, jenkins ci-cd"
date: 2024-03-04 19:25
tags:
  - topic/docker
  - topic/jenkins
  - topic/cicd
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
buildx 구축 시작
```docker
FROM python:3.12.0-slim-bullseye

COPY . /app
WORKDIR /app
EXPOSE 5555 5556
RUN apt-get update
RUN apt-get install -y gcc
RUN apt install -y libzmq3-dev
RUN export PIP_ONLY_BINARY=cmake
RUN pip install --upgrade pip
RUN pip install --no-binary=:all: pyzmq --verbose
CMD ["python", "router.py"]
```
이지랄 하다가 다 안되고
```docker
FROM python:3.12.0-slim-bullseye

COPY . /app
WORKDIR /app
EXPOSE 5555 5556
RUN apt-get update
RUN apt-get install -y build-essential libzmq3-dev
RUN pip install -r requirements.txt
CMD ["python", "router.py"]
```
이걸로 성공. 
docker build -t my-image/router-armv7:1.0.2 —platform linux/arm/v7 해서 빌드 성공
파이썬에서 zmq설치하면 파이썬 zmq로 하는거같은데 arm에서는 그게 안되는거같다.
그래서 libzmq3 따로 설치해주고 했음. libzmq3는 4에 비해 오래된거같은데 그냥 사용
docker buildx create —name armbuilder —driver docker-container 하고
docker buildx use해서 빌더 선택
이후에 똑같이 빌드하듯이 하는데 마지막에 push 붙여서 바로 허브에 올려줬다. buildx자체가 도커 컨테이너를 빌더로 쓰는거라 그런지 캐시만 남고 이미지로 뽑는건 건 오래걸리는거같아서 그냥 바로 허브에 push 해줌

---
라즈베리파이에 ci/cd 환경 구축
jenkins설치하려는데 이거 계속 무한 재부팅 되고있었다.
[여기 ](https://hyesunzzang.tistory.com/216) 참고해서 했는데.. 암튼 자바 버전 문제는 아니었고
[알고보니까](https://askubuntu.com/questions/1444777/installing-jenkins-service-fails-with-result-timeout/1445202#1445202?newreg=3af9282d42554c5c807e3da3441cc9f2) timeoutsecond문제였다. 젠킨스 service가 initial 실행 과정에서 시간을 꽤 잡아먹는데, 이때 걸리는 시간에 제한을 걸어뒀다. 라즈베리파이는 제한시간내에 initial을 모두 완료할 성능이 안돼서 자꾸 timeout에 걸려 안되고있던것. /lib/systemd/system/jenkins.service에 service탭에서 timeoutstartsec를 360으로 늘려서 해결 완료
![[IMG-20260321223708185.png]]
뿌듯
근데 jenkins플러그인이 완벽하게 설칭가 안된다. gradle이랑 pipeline이 중요한거같은데 걔네 두개만 안된다. durable-task인가 그게 설치가 안돼서 그걸 종속으로 갖는 gradle이랑 pipeline도 안되는거같다
sudo systemctl restart jenkins하니까 됐다. 해결완료

---
젠킨스는 잠깐 멈춰두고 proto 파일들 통합 시작.
각 worker, client, router별로 proto폴더 안에 중복된 내용의 proto util 파일들이 존재.
이걸 루트에 둬서 루트에서 꺼내쓰는 방식으로 바꿔보기로 했다.
git checkout -b task/proto_combine
일단 테스트용 docker-compose 파일 만듦. docker-compose -f 파일명 하면 파일 명시 가능
proto file import 관련해서 절대경로로 import 하도록 바꿈
```python
if __name__ != "__main__":
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from etc import message_util
```
zmq 테스트 수행. 실제 왔다갔다할 데이터 프레임만 protobuf로 serialize해서 보내기로했다.
zmq.ROUTER에서 zmq.recv_multipart는 여러 역할을 수행하는데, 클라이언트에게 특정 난수를 부여해서 나중에 워커로부터 작업이 다 끝난 데이터를 받으면 원래 요청했던 클라이언트에게 꽂아주는걸 가능하게 만들어줌.
