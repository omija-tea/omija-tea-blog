---
title: "github action deploy"
date: 2024-06-17
tags: []
publish: false
---
### volume
docker compose의 볼륨 기능을 이용해서 나중에 nginx.conf 편하게 바꿀 수 있도록 마운트 함
### network
fastapi를 포함한 나중에 추가될 백엔드들은 backend 네트워크에만 박아놓고 nginx는 nginx네트워크에 박아둠. 해당 네트워크는 80번과 443번 포트를 뚫어서 외부와 통신 가능하도록 만들었음
내부에서는 backend 네트워크를 이용해서 컨테이너 이름으로 통신할 예정
# github action deploy
1. 빌드하고 ECR에 푸시
2. SCP로 도커컴포즈 파일과  nginx 설정 파일을 SCP로 올림
3. SSH로 EC2에 들어가서 도커 컴포즈 업

# docker compose 설치
```bash
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
```
위 명령어로 도커 컴포즈 설치 완료

# CORS 지옥에서 빠져나오기
4. CORS가 떴음
5. nginx에서 CORS를 열어줬음. OPTION까지
6. fastapi에서 OPTIONS까지 CORS를 열어줬음
7. 그래도 CORS가 뜨길래 뭔가 했더니 파이썬에서 내부적으로 코드가 터져서 response에 헤더가 추가돼서 안 날아가고 있었음
8. 버그 고치니 CORS 해결 완료

# NGINX
### 몇가지 난관 및 해결
9. nginx를 따로 이미지화 할 것인가? 혹은 도커컴포즈에서 그냥 여러 파일들 볼륨으로 잡을것인가
    1. 전자는 보안면에서 안전하지만 ECR, github action을 새로 파야됨. 좀 배보다 배꼽이 커짐
    2. 후자는 보안면에서 조금 안좋을 수 있지만 구현이 편함. 그리고 우리는 nginx.conf, 인증서 파일 두개만 주입하면 되기때문에 이정도로도 적당하다고 판단했음
10. 어떻게 nginx.conf와 인증서파일을 주입할 것인가
    3. github secret에 다 박아놓고 github action에서 직접 환경변수화 한 이후 `printf $환경변수 >> 파일` 형태로 만든 후 SCP를 하든, EC2에서 직접 하든 했다.
11. 로깅 어떻게 할까
    4. access.log와  error.log 볼륨으로 잡아버렸음