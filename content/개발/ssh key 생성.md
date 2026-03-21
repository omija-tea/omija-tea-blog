---
title: ssh key 생성
date: 2025-09-25T11:15:00
tags:
  - topic/infra
  - topic/network
  - type/note
publish: false
---
```bash
ssh-keygen -t ed25519 -C "id@google.com"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 30080 id@server.kr

```
```bash
Host moana-khu
    HostName server.kr
    User id
    Port 30080
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
    UseKeychain yes

```