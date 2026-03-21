---
title: "nginx를 통한 load balancing with public ip"
date: 2024-10-19 20:51
tags: []
publish: false
---
## 요구사항
1. 각자의 public IP를 가진 여러개의 ec2 instance. 각각의 instance는 외부에 crawling을 수행할 예정
    1. 각각의 instance는 간단한 서버가 굴러가게 된다
2. load balancer역할을 하게 될 작은 ec2 인스턴스 하나 private에 둬야함
    2. ALB는 너무 비쌈
3. 하나의 인스턴스에서 실패할 경우 다른 인스턴스에 요청을 해야함


## 해결방법
보안그룹 잘 신경써서 해줘야 된다. 잘 열어주고 각각 private ip를 연결해줘야함
### LB instance
```python
http {
    upstream backend {
        server 172.31.10.122;
        server 172.31.4.226;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504 http_404;

            # 추가 설정
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```
이렇게 하면 404같은 응답이 왔을때 다른 서버로 요청을 보낼 수 있음
해결완료~
다운받을거 다 다운받았고, 어차피 얘는 내부적으로 돌릴 애니까 public ip를 떼도 됨.
어떻게 하는가? 이전에는 되지 않았음. 2024년 4월쯤 부터 됐다는걸로 보인다.
[How to Remove Public IP Addresses from AWS EC2 Instances](https://www.youtube.com/watch?v=rvkPG24ISv4&ab_channel=BrettGillett)
### AWS-CLi
```python
aws ec2 modify-network-interface-attribute --network-interface-id {eni id} --no-associate-public-ip-address
```
혹은 management console에서
ec2 instance → 네트워크 → 네트워크인터페이스(eni-asdf) 클릭 → 작업 → IP 주소 관리 → 퍼블릭 IP 자동 할당 취소 → 적용
이렇게 할 경우 IPAM(amazon vpc ip address manager)에서 확인했을때 할당되어있던 ip가 사라진걸 확인 가능