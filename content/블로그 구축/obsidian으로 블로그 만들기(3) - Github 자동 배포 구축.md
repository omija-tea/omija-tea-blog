---
title: obsidian으로 블로그 만들기(3) - 자동 배포 구축
date: 2026-04-30 15:36
tags: []
publish: false
date modified: 2026-04-30T15:42
data created: 2026-04-30T15:35
---
CD를 구축해보자.

### 지금까지 우리가 한것
1. 라즈베리파이를 WebDAV 서버로 하여 동기화 시스템 구축
2. quartz 설정 했음
이제 배포만 해두면 바로 볼 수 있다!

웬만하면 내 블로그 말고 [여기](https://quartz.jzhao.xyz/hosting)를 참고하는게 가장 정확하다.
## 준비물
1. 도메인
2. 라즈베리파이(이미 충족)
3. github 계정

# Github Action을 씁시다
1. Github에 repo하나 만들고, 해당 repo를 remote로 등록
2. .github/workflows에 deploy.yml을 작성
```yaml
name: Deploy Quartz site to GitHub Pages
 
on:
  push:
    branches:
      - v4
 
permissions:
  contents: read
  pages: write
  id-token: write
 
concurrency:
  group: "pages"
  cancel-in-progress: false
 
jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Fetch all history for git info
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install Dependencies
        run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public
 
  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
[여기서 가져옴](https://quartz.jzhao.xyz/hosting)
