---
title: "intellij autocp 한글 인코딩 문제"
date: 2026-01-29
tags: []
publish: false
---
Setting → Tools → AutoCp → Languages → java
Build Command : javac -encoding UTF-8 @in -d @dir
Execute Command : java -Dfile.encoding=UTF-8 -cp @dir Main
