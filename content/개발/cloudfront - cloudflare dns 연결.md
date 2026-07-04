---
title: "cloudfront - cloudflare dns 연결"
date: 2024-12-22 20:04
tags:
  - topic/aws
  - topic/cloudflare
  - topic/infra
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
1. cloudflare에서 도메인 발급
2. cloudflare SSL/TLS를 Full(strict)로 변경
3. edge certificates에서 minimum TLS Version을 TLS 1.2로 변경
4. aws certificate manager에서 인증서 발급
5. [asdf.asdf.com](http://asdf.asdf.com/) 으로 인증서 발급
6. Domain에 나오는 CNAME name과  CNAME value를 복사
7. cloudflare DNS에서 CNAME record 추가 (dns only)
8. acm status : success 확인
9. cloudfront로 이동
10. 배포 들어가서 settings편집, custom ssl certificate 연결 (acm 인증서 발급하고 5분정도 기다려야됨)
11. cloudflare로 이동
12. CNAME 레코드 name을 asdf.asdf.com으로, content를 cloudfront의 배포도메인 이름으로 변경 (DNS only)
13. cloudfront로 이동해서 alternate domain name에 [asdf.asdf.com](http://asdf.asdf.com/) 추가 (DNS only)

전부 마무리 하고 한 10분정도 기다리면 연결 완료
