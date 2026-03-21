---
base: "[[TIL.base]]"
태그: []
날짜: 2024-03-06
---
worker, router등의 proto화 시작
etc폴더를 밖에 두고 했는데.. 엄청 멍청했다. worker router client가 각각 컨테이너라는 사실을 까먹음..
약간 큰일났다. proto를 wsc에서도 쓰고 상위의 worker에서도 사용하는데 두곳에서 사용하면 global 변수때문에 호환이 안되는것같다. [https://github.com/grpc/grpc/issues/35918](https://github.com/grpc/grpc/issues/35918)
