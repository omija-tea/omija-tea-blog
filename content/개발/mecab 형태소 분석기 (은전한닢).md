---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2025-01-17
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
