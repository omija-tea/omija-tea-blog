---
base: "[[TIL.base]]"
태그: []
날짜: 2024-06-06
---
1. 간단하게 퍼블릭 하나 올리고 8000번 포트 인바운드로 잡아놨음
2. ec2에 fastapi 예제 올려놓음
3. 내도메인.한국에서 [ohmeet.kro.kr](http://ohmeet.kro.kr/) 따놓음
4. api.ohmeet.kro.kr에 잡아놓음
5. route 53에서 호스팅 영역 생성 했음

근데 여기까지 하고 그만둠. route53은 과금이 되고 ALB도 어차피 과금이 된다.
테스트 어플리케이션에 그정도까지 사용해야하나? 그냥 직접 fastapi에 https 적용하면 안되나?
[그래서 이 블로그 따라함](https://junah201.medium.com/fastapi%EC%97%90-nginx-%EC%97%86%EC%9D%B4-https-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-2fbf6dc2e0f2)
## ECR
push 하는법
6. ECR 하나 ohmeet-server-ecr로 만들었음
7. aws 먼저 로그인 하고
8. **aws ecr get-login-password --region ap-northeast-2| **docker login --username AWS --password-stdin [211125555611.dkr.ecr.eu-north-1.amazonaws.com/ohmeet-server-ecr](http://211125555611.dkr.ecr.eu-north-1.amazonaws.com/ohmeet-server-ecr)
9. docker tag playjnj/ohmeet:0.0.0 [211125555611.dkr.ecr.ap-northeast-2.amazonaws.com/ohmeet-server-ecr:0.0.0](http://211125555611.dkr.ecr.ap-northeast-2.amazonaws.com/ohmeet-server-ecr:0.0.0)
10. docker push [211125555611.dkr.ecr.ap-northeast-2.amazonaws.com/ohmeet-server-ecr:0.0.0](http://211125555611.dkr.ecr.ap-northeast-2.amazonaws.com/ohmeet-server-ecr:0.0.0)

AWS로 로그인 해주고 이미지에 태그 달아주고 올림
pull 하는법
11. 똑같이 aws 로그인하고 docker login
12. aws ecr describe-repositories
13. aws ecr describe-images --repository-name ohmeet-server-ecr
14. docker pull [211125555611.dkr.ecr.ap-northeast-2.amazonaws.com/ohmeet-server-ecr](http://211125555611.dkr.ecr.ap-northeast-2.amazonaws.com/ohmeet-server-ecr):0.0.0


## https
certbot으로 letsencrypt 인증서 받으려고 했는데 kro.kr은 너무 요청이 많아서 안된다고 한다.
그래서 sslforfree라는 사이트를 사용함.
DNS(CNAME) 방식을 이용해서 verification 진행. NAME을 ohmeet.kro.kr앞에, 향하는 곳을 point to 입력 해서 수행했음
ca_bundle(chain.pem), certificate.crt(fullchain.pem), private.key (privkey.pem) 세개를 받음
…근데 이거 안전하지 않은 https로 뜨길래 mkcert로함
…근데 안됨. ㅅㅂ 그냥 aws 써야겠다
## github cli in ec2
```bash
type -p yum-config-manager >/dev/null || sudo yum install yum-utils
sudo yum-config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
sudo yum install gh
```
위 명령어로 gh 설치
이후 `gh auth login`
이후에는 따라서 하면 알아서 로그인 됨
