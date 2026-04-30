---
title: obsidian으로 블로그 만들기(1) - obsidian remotely save
date: 2026-04-28 12:10
tags:
  - topic/raspberrypi
  - topic/cloudflare
  - topic/productivity
  - type/note
publish: true
date modified: 2026-04-30T16:27
data created: 2026-04-28T12:10
---
# 요구사항
1. 내가 수행하는 편집이 실시간으로 업데이트 되었으면 좋겠음
2. 전체 블로그가 자동으로 동기화 되지만, blog에 배포하는 게시물은 따로 분리해두고 싶음
3. 핸드폰 - 윈도우 - 맥북 모든곳에서 동시에 사용하고 싶음. 그리고 새로운 기기를 자주 접하는 상황임 ^0dc6bf
4. 기왕 라즈베리파이가 있으니 이걸 사용하고 싶음


# 첫 시도
## Self-hosted liveSync
Self-hosted liveSync라는 플러그인이 존재하더라. 이걸 사용해보자는 생각이 들었다.
해당 플러그인은 couchDB를 이용하는 플러그인이다. 기능도 매우 다양하고, 라즈베리파이에 couchDB만 설치하면 가능한 부분이라 시도했다.
### 시도
1. 라즈베리파이에 couch DB 설치
2. cloudflare tunnel 을 이용해서 couch.raspberrypi.com 을 couchDB 포트로 터널링
3. 여기에 연결!
4. 그 외 여러가지 시도를 하며 일주일정도를 보냈으나.. 결국 폐기했으니 자세히 적지는 않겠습니다
### 문제
1. **충돌이 굉장히 자주난다...!!!** 이거 설정하면서 couchDB 초기화만 몇번을 했는지 모르겠다.
2. 설정이 꽤나 복잡하다. couchDB 잡아주고 용량 잡아주고 설정 잡아주고... 그걸 매번 새로운 기기에 갈 때마다 해야한다([[#^0dc6bf|기기 자주 바뀜]])
다른것보다, 충돌이 매우 자주나는 문제 때문에 굉장히 답답했고, 다른 솔루션을 찾아보기로 하였다.

# 두번째 시도
## Remotely Save
Remotely Save라는 옵시디언 커뮤니티 플러그인이 또 있다. 얘는 S3, WebDAV, Dropbox, Onedrive등을 저장소로 사용할 수 있는 스펙을 가진 플러그인이다.
> [!NOTE]- WebDAV
> HTTP를 확장한 프로토콜로, 인터넷을 통해 원격 서버의 파일을 마치 자신의 컴퓨터 폴더처럼 관리할 수 있게 해주는 기술!! FTP보다 현대적이다!
여기서 중요한건 **HTTP를 확장한 프로토콜** 이라는것!!! 이말인 즉슨 cloudflare tunnel을 사용하는데 문제가 없다..!

> [!NOTE]- cloudflare tunnel
> 보통 우리는 서버를 열때 포트를 열고, 라우터가 존재하면 포트로 접근가능한 포트 포워딩을 해주고.. 꽤 귀찮은 과정을 거쳐야 한다.
> cloudflare tunnel 은 이걸 반대로 가능하게 해준다! 내 서버쪽에서 직접 cloudflare 로 연결을 해버리고, 나는 cloudflare로만 요청을 보내면 되는구조!
> 다만, http스펙만 지원한다. http스펙이 아니어도 가능은 하지만, 그럴려면 tunnel을 사용하는 기기 측에서도 cloudflare 프로그램을 설치해야한다. 암호화를 해야하기 때문

### 시도
1. 라즈베리파이에 webDAV docker compose 파일 만들고 실행
```yaml
asdf:
	asdf:
		asdf = wef
```
2. cloudflare tunnel 설정. webDAV의 포트와 연결되는 터널을 만들어 주면 된다.
3. 아무 기기에서든 obsidian을 깔고 remotely save 플러그인을 설치한 후 설정만 잡아주면..? 끝!!매우 간단
### 커스터마이즈
1. 관리의 편의성을 위해 data 폴더 안에 각 vault를 모아두고 싶었고, 그래서 docker compose 파일이 위와 같이 변경되었다. 이와 동시에 Remotely Save 플러그인에서 Change the Remote base directory 에 원하는 vault 이름을 넣어주면 성공!
	* 이렇게 되면 보안상으로는 좋지 않다 
		* 각 webdav 별로 관리되는것이 아니라 한 webdav에서 관리를 하므로, 내 vault가 아닌 다른 vault의 내용도 원하면 전부 볼 수 있음
	* 근데 어차피 나 혼자 쓸거니까 괜찮
2. 암호화는 일부러 안했다. 블로그에 자동으로 배포되게 만들건데, 그러면 그냥 raw 데이터가 raspberry pi에 저장되는게 훨씬 편함
# 결과
Self-hosted liveSync에 비해 매우 간단하게 구성이 가능했다. 다른 기기에 가더라도 Remotely save 플러그인만 깔고 설정 몇개만 잡아주면 뚝딱 연결된다.
당연히 노션급 동기화를 보여줄 순 없지만 이정도면 전혀 문제없이 사용 가능하다!!







---
**[[obsidian으로 블로그 만들기(1) - obsidian remotely save]]**
[[obsidian으로 블로그 만들기(2) - quartz 설정]]
[[obsidian으로 블로그 만들기(3) - Github 자동 배포 구축]]
[[obsidian으로 블로그 만들기(4) - 자동 배포 구축]]
[[obsidian으로 블로그 만들기(5) - google search console 등록]]