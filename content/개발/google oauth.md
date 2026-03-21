---
base: "[[TIL.base]]"
태그: []
날짜: 2024-06-08
---
oauth가 뭘까? 제 3자로부터 받아온 인증정보를 이용하는것이다.
[이 글이 많이 도움 됐던 것 같다](https://blog.naver.com/shino1025/222226707146) 
## 우리의 프로세스
1. 프론트엔드에서 구글 로그인을 제공하여 authorization token을 받아옴
2. authorization token을 백엔드로 넘겨줌
3. 백엔드에서는 authorization token을 이용하여 [oauth2.googleapis.com/token으로](http://oauth2.googleapis.com/token으로) post 요청을 보내고, access_token, expires_in, refresh_token, id_token등을 받아옴
4. 여기서 주목해야할 것은 id_token. id_token 내부에 sub, 스코프에서 설정했던 유저 정보들이 들어있음
5. sub는 구글 계정마다 unique한 value. db에 박으면 된다.


## 발생했던 문제
6. 환경변수
    - 이 씹색기… 자꾸 .venv 자체에 박혀버려서 헷갈리게 했음
    - load_dotenv(override=True)를 해서 아예 엎어버리든 .venv 관리를 잘하든 하자
7. 구글 
    - 테스트하기위한 authorization code가 필요했는데 이거 [https://developers.google.com/oauthplayground/](https://developers.google.com/oauthplayground/) 여기서 제공한다.
    - 다만 이걸 사용하기 위해서는 나만의 client_id, client_secret이 필요하다. 톱니바퀴 누르고 그거 입력하면 구글이 프론트 역할을 대신 해준다.
    - 그렇게 발급받은 authorization token을 이용해서 주물주물하면 다 된다
8. 보안
    - OAuth2.0 CSRF 취약점 있다. 생각해두자. [https://meetup.nhncloud.com/posts/105](https://meetup.nhncloud.com/posts/105)


## fast api
파일 여러개로 쪼개는거 배움. 쉽다.
이제 우리 서비스 자체 oauth를 구현해야하는데… 진짜 막막하다. 해봐야지 뭐