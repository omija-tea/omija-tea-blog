---
base: "[[TIL.base]]"
태그: []
날짜: 2024-06-09
---
architecture 없이 fastapi 공식 guide 스타일로 마구잡이 개발하다가 refactoring과 테스팅이 매우 어려워졌다.
controller - service - repository의 layered architecture을 적용해보자.
controller에서는 service를 DI 받아서 사용하고, service에서는 repository를 DI받아서 사용한다.
