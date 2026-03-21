---
base: "[[IMG-20260321214755797.base]]"
태그: []
날짜: 2024-04-10
---
oh my posh 테마 적용 방법
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\jandedobbeleer.omp.json" | Invoke-Expression
