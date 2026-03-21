---
title: "oh-my-posh 테마 적용"
date: 2024-04-10
tags: []
publish: false
---
oh my posh 테마 적용 방법
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\jandedobbeleer.omp.json" | Invoke-Expression
