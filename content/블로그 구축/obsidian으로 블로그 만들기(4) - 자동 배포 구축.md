---
title: obsidian으로 블로그 만들기(4) - 자동 배포 구축
date: 2026-04-30 16:13
tags: []
publish: true
date modified: 2026-04-30T16:27
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

> [!NOTE]- deploy-service.sh
> ```sh
> #!/bin/bash
> # ============================================================
> # deploy-service.sh — systemd 서비스 등록 & 시작
> # ============================================================
> 
> set -euo pipefail
> 
> SCRIPTS_DIR="$HOME/scripts"
> DEPLOY_SCRIPT="$SCRIPTS_DIR/blog-deploy.sh"
> SERVICE_NAME="blog-deploy"
> PI_USER="$(whoami)"
> 
> echo "=== [1/4] 스크립트 확인 ==="
> if [ ! -f "$DEPLOY_SCRIPT" ]; then
>     echo "ERROR: $DEPLOY_SCRIPT 파일이 없습니다."
>     echo "먼저 blog-deploy.sh를 ~/scripts/에 넣어주세요."
>     exit 1
> fi
> chmod +x "$DEPLOY_SCRIPT"
> echo "blog-deploy.sh 확인 완료"
> 
> echo ""
> echo "=== [2/4] 로그 파일 준비 ==="
> sudo touch /var/log/blog-deploy.log
> sudo chown ${PI_USER}:${PI_USER} /var/log/blog-deploy.log
> 
> echo ""
> echo "=== [3/4] systemd 서비스 생성 ==="
> sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << EOF
> [Unit]
> Description=Obsidian Blog Auto Deploy to GitHub
> After=network-online.target
> Wants=network-online.target
> 
> [Service]
> Type=simple
> User=${PI_USER}
> Group=${PI_USER}
> ExecStart=${DEPLOY_SCRIPT}
> Restart=always
> RestartSec=30
> StartLimitIntervalSec=300
> StartLimitBurst=5
> 
> Environment=HOME=/home/${PI_USER}
> Environment=PATH=/usr/local/bin:/usr/bin:/bin
> Environment=GIT_SSH_COMMAND=ssh -o StrictHostKeyChecking=accept-new
> 
> MemoryMax=256M
> CPUQuota=50%
> 
> StandardOutput=journal
> StandardError=journal
> SyslogIdentifier=blog-deploy
> 
> [Install]
> WantedBy=multi-user.target
> EOF
> 
> echo ""
> echo "=== [4/4] 서비스 활성화 & 시작 ==="
> sudo systemctl daemon-reload
> sudo systemctl enable "$SERVICE_NAME"
> sudo systemctl start "$SERVICE_NAME"
> 
> echo ""
> echo "서비스 등록 완료!"
> echo ""
> echo "유용한 명령어:"
> echo "  상태 확인:  sudo systemctl status $SERVICE_NAME"
> echo "  로그 보기:  journalctl -u $SERVICE_NAME -f"
> echo "  상세 로그:  tail -f /var/log/blog-deploy.log"
> echo "  재시작:     sudo systemctl restart $SERVICE_NAME"
> echo "  중지:       sudo systemctl stop $SERVICE_NAME"
> ```

> [!NOTE]- check-status.sh
> ```sh
> #!/bin/bash
> # ============================================================
> # check-status.sh — 블로그 시스템 상태 점검
> # ============================================================
> 
> RED='\033[0;31m'
> GREEN='\033[0;32m'
> YELLOW='\033[1;33m'
> NC='\033[0m'
> 
> ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
> fail() { echo -e "  ${RED}✗${NC} $1"; }
> warn() { echo -e "  ${YELLOW}!${NC} $1"; }
> 
> QUARTZ_DIR="$HOME/quartz"
> VAULT_BLOG="$HOME/obsidian/data/vault/blog"
> 
> echo "═══════════════════════════════════════"
> echo "  블로그 시스템 상태 점검"
> echo "═══════════════════════════════════════"
> echo ""
> 
> # 1. 필수 프로그램
> echo "▸ 필수 프로그램"
> command -v node &>/dev/null && ok "Node.js $(node -v)" || fail "Node.js 미설치"
> command -v git &>/dev/null && ok "Git $(git --version | cut -d' ' -f3)" || fail "Git 미설치"
> command -v inotifywait &>/dev/null && ok "inotifywait 설치됨" || fail "inotify-tools 미설치"
> command -v rsync &>/dev/null && ok "rsync 설치됨" || fail "rsync 미설치"
> echo ""
> 
> # 2. 디렉토리
> echo "▸ 디렉토리 구조"
> [ -d "$VAULT_BLOG" ] && ok "Vault blog: $VAULT_BLOG" || fail "Vault blog 없음: $VAULT_BLOG"
> [ -d "$QUARTZ_DIR" ] && ok "Quartz repo: $QUARTZ_DIR" || fail "Quartz repo 없음: $QUARTZ_DIR"
> if [ -d "$QUARTZ_DIR/content" ] && [ ! -L "$QUARTZ_DIR/content" ]; then
>     ok "content/ 디렉토리 존재 (실제 폴더)"
> elif [ -L "$QUARTZ_DIR/content" ]; then
>     warn "content가 심볼릭 링크임! rsync 방식으로 전환 필요"
> else
>     fail "content 폴더 없음"
> fi
> echo ""
> 
> # 3. Git 상태
> echo "▸ Git 상태"
> if [ -d "$QUARTZ_DIR/.git" ]; then
>     cd "$QUARTZ_DIR"
>     REMOTE=$(git remote get-url origin 2>/dev/null || echo "none")
>     BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
>     ok "Remote: $REMOTE"
>     ok "Branch: $BRANCH"
> 
>     UNCOMMITTED=$(git status --short content/ | wc -l)
>     if [ "$UNCOMMITTED" -gt 0 ]; then
>         warn "미커밋 변경: ${UNCOMMITTED}개 파일"
>     else
>         ok "content 변경사항 없음 (깨끗)"
>     fi
> 
>     # rsync 동기화 상태 확인
>     DIFF_COUNT=$(rsync -avn --delete "${VAULT_BLOG}/" "${QUARTZ_DIR}/content/" 2>/dev/null | grep -c -E '^\S' || echo 0)
>     if [ "$DIFF_COUNT" -le 3 ]; then
>         ok "vault ↔ content 동기화 상태 양호"
>     else
>         warn "vault와 content가 다름 (${DIFF_COUNT}개 차이). rsync 필요"
>     fi
> 
>     ssh -T git@github.com 2>&1 | grep -q "successfully" && \
>         ok "GitHub SSH 연결 정상" || warn "GitHub SSH 연결 확인 필요"
> else
>     fail "Git 레포가 아님"
> fi
> echo ""
> 
> # 4. systemd 서비스
> echo "▸ 배포 서비스"
> if systemctl is-active --quiet blog-deploy 2>/dev/null; then
>     ok "blog-deploy 서비스 실행 중"
> else
>     fail "blog-deploy 서비스 미실행"
> fi
> 
> if systemctl is-enabled --quiet blog-deploy 2>/dev/null; then
>     ok "부팅 시 자동 시작 활성화"
> else
>     warn "부팅 시 자동 시작 비활성화"
> fi
> echo ""
> 
> # 5. 최근 배포 로그
> echo "▸ 최근 배포 기록 (최근 5줄)"
> if [ -f /var/log/blog-deploy.log ]; then
>     tail -5 /var/log/blog-deploy.log | while read -r line; do
>         echo "  $line"
>     done
> else
>     warn "배포 로그 파일 없음"
> fi
> echo ""
> 
> # 6. 블로그 콘텐츠 통계
> echo "▸ 블로그 콘텐츠 통계"
> if [ -d "$VAULT_BLOG" ]; then
>     MD_COUNT=$(find "$VAULT_BLOG" -name "*.md" | wc -l)
>     IMG_COUNT=$(find "$VAULT_BLOG" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.gif" -o -name "*.svg" \) | wc -l)
>     DRAFT_COUNT=$(grep -rl "draft: true" "$VAULT_BLOG"/ 2>/dev/null | wc -l)
>     ok "마크다운 파일: ${MD_COUNT}개"
>     ok "이미지 파일: ${IMG_COUNT}개"
>     [ "$DRAFT_COUNT" -gt 0 ] && warn "초안(draft): ${DRAFT_COUNT}개" || ok "초안 없음"
> fi
> echo ""
> 
> # 7. 사이트 접속 확인
> echo "▸ 사이트 접속"
> HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://blog.omija-tea.work 2>/dev/null || echo "000")
> if [ "$HTTP_CODE" = "200" ]; then
>     ok "blog.omija-tea.work 접속 정상 (HTTP $HTTP_CODE)"
> elif [ "$HTTP_CODE" = "000" ]; then
>     fail "blog.omija-tea.work 접속 불가 (네트워크 또는 DNS 문제)"
> else
>     warn "blog.omija-tea.work 응답 코드: $HTTP_CODE"
> fi
> echo ""
> echo "═══════════════════════════════════════"
> ```

claude가 도와줬다.
* blog-deploy.sh : 주기적으로 변경사항을 확인해서 quartz 쪽으로 데이터를 끌어온다
* deploy-service.sh : blog-deploy.sh 를 systemd 에 서비스로 등록해준다
* check-status.sh : status 확인용 sh
여기까지 완료하면 끝!


# 이제 뭐가 되느냐
1. 폰이든, 컴이든 어디서든 obsidian의 blog 폴더에서 게시물을 작성하거나 수정한다
2. Remotely Save 플러그인을 통해 알아서 라즈베리파이로 데이터가 흘러들어간다
3. blog-deploy.sh 서비스가 데이터 차이를 발견하고 quartz 쪽으로 데이터를 끌어온다
4. 알아서 github 에 push가 들어간다
5. github action이 돌아가고 배포가 된다

끝~

---
[[obsidian으로 블로그 만들기(1) - obsidian remotely save]]
[[obsidian으로 블로그 만들기(2) - quartz 설정]]
[[obsidian으로 블로그 만들기(3) - Github 자동 배포 구축]]
**[[obsidian으로 블로그 만들기(4) - 자동 배포 구축]]**
[[obsidian으로 블로그 만들기(5) - google search console 등록]]