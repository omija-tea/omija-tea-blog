---
title: "intellij autocp 한글 인코딩 문제"
date: 2026-01-29 20:36
tags:
  - topic/java
  - topic/intellij
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
Setting → Tools → AutoCp → Languages → java
Build Command : javac -encoding UTF-8 @in -d @dir
Execute Command : java -Dfile.encoding=UTF-8 -cp @dir Main
