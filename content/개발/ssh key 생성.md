---
base: "[[IMG-20260321214755797.base]]"
태그: []
---
```bash
ssh-keygen -t ed25519 -C "playjnj@khu.ac.kr"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 30080 playjnj@moana.khu.ac.kr

```
```bash
Host moana-khu
    HostName moana.khu.ac.kr
    User playjnj
    Port 30080
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
    UseKeychain yes

```