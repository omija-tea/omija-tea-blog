---
base: "[[TIL.base]]"
태그: []
날짜: 2024-03-05
---
hyperv 문제 해결하려다 보니까 cmd에서 dism이랑 dfc인가 그거 해야되는데 cmd가 안켜지는 문제 발생. 잠깐 켜졌다가 바로 꺼지더라. 그걸 해결하려면 cmd를 켜야되는 무한반복 상황 발생
그래서 윈도우 포맷했다.
이거저거 다 설치 완료.
onenote2016에서 계속 동기화 시도떄마다 튕기는 현상 발생. 이거저거 시도중..
oh-my-posh에서 테마가 바뀌지 않는 현상 발생. 폰트도 문제가 있었다. hack nerd 폰트를 싹다 다운받고 한 15개 파일 되는걸 전부 폰트 설치 했더니 됐다. 
oh-my-posh --init --shell pwsh --config ~\AppData\Local\Programs\oh-my-posh\themes\tonybaloney.omp.json | Invoke-Expression
이게 정석 명령어. 이거 쓰니까 json 바꿀때마다 바로바로 테마 바뀌었다.
