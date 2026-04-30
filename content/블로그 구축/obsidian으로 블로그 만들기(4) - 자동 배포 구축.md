---
title: obsidian으로 블로그 만들기(4) - 자동 배포 구축
date: 2026-04-30 16:13
tags: []
publish: false
date modified: 2026-04-30T16:13
data created: 2026-04-30T16:13
---
이제 마무리 해보자.

일반적으로는 content 폴더에 obsidain vault 속 게시물을 symlink 걸어서 배포하는것 같은데.. 난 잘 안됐다.
그래서 rsync를 이용하였다.

> [!NOTE]- blog-deploy.sh
> ```sh
> #!/bin/bash
> 
> set -uo pipefail
> 
> # ─── 설정 ───────────────────────────────────────────
> VAULT_BLOG="$HOME/obsidian/data/vault/blog"
> QUARTZ_DIR="$HOME/quartz"
> BRANCH="v4"
> POLL_INTERVAL=120    # 2분마다 확인
> LOG="/var/log/blog-deploy.log"
> MAX_LOG_SIZE=5242880
> # ────────────────────────────────────────────────────
> 
> rotate_log() {
>     if [ -f "$LOG" ] && [ "$(stat -c%s "$LOG" 2>/dev/null || echo 0)" -gt "$MAX_LOG_SIZE" ]; then
>         mv "$LOG" "${LOG}.old"
>     fi
> }
> 
> log() {
>     rotate_log
>     echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"
> }
> 
> sync_and_push() {
>     # rsync로 vault → content 복사
>     rsync -a --delete \
>         "${VAULT_BLOG}/" "${QUARTZ_DIR}/content/"
> 
>     cd "$QUARTZ_DIR"
>     git add content/
> 
>     # 변경사항 없으면 스킵
>     if git diff --cached --quiet; then
>         return 0
>     fi
> 
>     # 변경사항 있으면 커밋 & push
>     CHANGED_COUNT=$(git diff --cached --name-only | wc -l)
>     log "변경 파일 ${CHANGED_COUNT}개 감지"
>     git diff --cached --name-only | head -5 >> "$LOG"
> 
>     git commit -m "blog: auto-update $(date '+%Y-%m-%d %H:%M') (${CHANGED_COUNT} files)" >> "$LOG" 2>&1
> 
>     for attempt in 1 2 3; do
>         if git push origin "$BRANCH" >> "$LOG" 2>&1; then
>             log "Push 성공!"
>             return 0
>         fi
>         log "Push 실패 (시도 $attempt/3)"
>         sleep 10
>     done
> 
>     log "ERROR: push 3회 실패"
>     return 1
> }
> 
> # ─── 메인 ──────────────────────────────────────────
> log "=========================================="
> log "블로그 자동 배포 시작 (v3 - 폴링)"
> log "감시: $VAULT_BLOG"
> log "주기: ${POLL_INTERVAL}초"
> log "=========================================="
> 
> # 원격 변경사항 pull
> cd "$QUARTZ_DIR"
> git pull --rebase origin "$BRANCH" >> "$LOG" 2>&1 || true
> 
> # 시작 시 한 번 동기화
> sync_and_push
> 
> # 폴링 루프
> while true; do
>     sleep "$POLL_INTERVAL"
>     sync_and_push
> done
> ```

