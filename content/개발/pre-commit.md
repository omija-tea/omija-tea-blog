---
title: "pre-commit"
date: 2024-07-29 11:13
tags: []
publish: false
---
rye tools install pre-commit
pre-commit install
```yaml
repos:
- repo: https://github.com/pre-commit/pre-commit-hooks
  rev: v4.5.0
  hooks:
    - id: check-yaml
    - id: end-of-file-fixer
    - id: trailing-whitespace
- repo: https://github.com/charliermarsh/ruff-pre-commit
  rev: 'v0.4.10'
  hooks:
    - id: ruff
    - id: ruff-format
```
