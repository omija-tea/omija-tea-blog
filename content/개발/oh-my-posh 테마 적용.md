---
title: "oh-my-posh 테마 적용"
date: 2024-04-10 13:05
tags:
  - topic/windows
  - topic/terminal
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
oh my posh 테마 적용 방법
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\jandedobbeleer.omp.json" | Invoke-Expression
