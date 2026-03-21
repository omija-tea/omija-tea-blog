---
title: "cloudflared 설치"
date: 2025-02-18 19:06
tags: []
publish: false
---
cloudflare tunnel을 사용하면 ip를 숨길수 있다길래 한번 시도해보자

1. cloudflare 사이트 들어가서 zero trust 켜주기
2. ec2 서버 접속

```bash
# cloudflared 설치
curl -fsSl https://pkg.cloudflare.com/cloudflared-ascii.repo | sudo tee /etc/yum.repos.d/cloudflared-ascii.repo
sudo yum update
sudo yum install cloudflared

# cloudflared tunnel 로그인
cloudflared tunnel login
sudo mkdir -p /root/.cloudflared
sudo cp ~/.cloudflared/cert.pem /root/.cloudflared/

# cloudflare tunnel 생성
cloudflared tunnel create test-tunnel

# cloudflare tunnel 생성 확인 및 id 복사. 이후 config.yaml에서 사용됨
cloudflared tunnel list
sudo cp ~/.cloudflared/*.json /root/.cloudflared/

sudo mkdir -p /etc/cloudflared
cd /etc/cloudflared/

```
/etc/cloudflared 에 config.yml 파일 생성
```yaml
tunnel: [TUNNEL_ID]
credentials-file: /root/.cloudflared/[TUNNEL_ID].json

ingress:
  - hostname: api.example.com # cloudflare에서 연결할 domain
    service: http://localhost:8080  # 백엔드 서버 포트에 맞게 수정
  - service: http_status:404

# 선택적 설정
originRequest:
  connectTimeout: 30s
  noTLSVerify: false
```
```bash
sudo chmod 644 ./config.yml
cloudflared tunnel route dns ${TUNNEL_ID} api.example.com
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```
