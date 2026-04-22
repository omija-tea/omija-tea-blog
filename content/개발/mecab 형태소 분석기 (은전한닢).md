---
title: mecab 형태소 분석기 (은전한닢)
date: 2025-01-17 13:47
tags:
  - topic/python
  - topic/NLP
  - type/note
publish: true
date created: 2026-03-21T23:46
date modified: 2026-04-22T16:17
---
# mecab-ko 다운로드 및 설치 (mac 기준)
```bash
curl -LO https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz
tar zxfv mecab-0.996-ko-0.9.2.tar.gz
cd mecab-0.996-ko-0.9.2
./configure
make
make check
sudo make install
```
# mecab-ko-dic 다운로드 및 설치
```bash
curl -LO https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz
tar zxfv mecab-ko-dic-2.1.1-20180720.tar.gz
cd mecab-ko-dic-2.1.1-20180720
./autogen.sh
./configure 
make
sudo make install
```
# mecab-python3 설치
`rye add mecab-python3`
`rye sync` 
