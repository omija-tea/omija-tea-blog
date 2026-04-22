---
title: "vscode neovim"
date: 2024-05-28 19:59
tags:
  - topic/vscode
  - topic/developer-tools
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
### vscode neovim visual 모드에서 copilot inline chat이 안 되는 문제
```json
{
    "command": "inlineChat.start",
    "key": "ctrl+i",
    "when": "editorTextFocus && neovim.mode != insert",
    "args": "<C-i>"
}
```
keybindings.json에 해당 문구 추가하면 된다.

### clipboard 공유가 안 되는 문제
init.nvim 만들어서
```shell
set clipboard+=unnamedplus
```
추가하면 된다. 확장자 init.nvim 맞는지 확인. init.nvim.txt라서 좀 고생했음
