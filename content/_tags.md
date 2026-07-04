---
title: 블로그 태그 카탈로그
publish: false
tags:
  - type/note
---

> [!info] 단일 진실원 (Single Source of Truth)
> 이 파일은 블로그의 **모든 태그를 관리하는 정본**입니다.
> Claude (`tag-curator` 스킬)가 자동으로 관리하므로, 사용자가 직접 편집할 필요 없습니다.
> 새 글에 신규 태그가 등장하면 Claude가 적절한 카테고리에 자동 추가하고, `blog/index.md`의 `tags:` 배열도 동기 갱신합니다.

## 동기화 규칙

| 위치 | 역할 | 갱신 주체 |
|------|------|-----------|
| `blog/_tags.md` (이 파일) | 정본: 카테고리 + 태그 + 설명 | Claude `tag-curator` |
| `blog/index.md` `tags:` 배열 | Quartz4 빌드용 파생 (블로그 홈 노출) | `tag-curator`가 _tags.md에서 자동 재생성 |
| 각 글 frontmatter `tags:` | 실제 사용 | `blog-organizer` (글 작성·정리 시) |

## 언어 / 런타임

| 태그 | 설명 |
|------|------|
| `topic/python` | 파이썬 전반 (비동기, 라이브러리) |
| `topic/crawling` | 웹 크롤링, 스크래핑 (BeautifulSoup, Scrapy, Selenium 등) |
| `topic/java` | 자바 전반 |
| `topic/jvm` | JVM 동작 원리 |
| `topic/flutter` | Flutter 앱 개발 |

## 프레임워크 / 라이브러리

| 태그 | 설명 |
|------|------|
| `topic/fastapi` | FastAPI 서버 개발 |
| `topic/flask` | Flask 서버 개발 |
| `topic/sqlalchemy` | SQLAlchemy ORM |
| `topic/alembic` | DB 마이그레이션 |
| `topic/pydantic` | 데이터 검증, 스키마 |
| `topic/pytest` | 테스트 작성 |

## AWS

| 태그 | 설명 |
|------|------|
| `topic/aws` | AWS 전반 (EC2, RDS, IAM 등) |
| `topic/lambda` | Lambda 함수 |
| `topic/s3` | S3 오브젝트 스토리지 |
| `topic/infra` | 인프라 구성 전반 |

## 인프라 / 네트워크

| 태그 | 설명 |
|------|------|
| `topic/docker` | Docker, docker-compose |
| `topic/nginx` | Nginx 설정, 프록시, LB |
| `topic/cicd` | CI/CD 파이프라인 |
| `topic/network` | 네트워크 일반 |
| `topic/cloudflare` | Cloudflare DNS, 프록시, 터널 |
| `topic/https` | SSL/TLS, 인증서 |
| `topic/raspberrypi` | 라즈베리파이 |

## 데이터베이스

| 태그 | 설명 |
|------|------|
| `topic/database` | DB 전반 |
| `topic/postgresql` | PostgreSQL, PostGIS |
| `topic/mysql` | MySQL |
| `topic/search` | FTS, pg_bigm, ts_vector |
| `topic/NLP` | 형태소 분석, 자연어처리 |

## 개발 도구

| 태그 | 설명 |
|------|------|
| `topic/git` | Git, GitHub |
| `topic/vscode` | VSCode 설정, 확장 |
| `topic/pycharm` | PyCharm 설정 |
| `topic/intellij` | IntelliJ IDEA |
| `topic/jenkins` | Jenkins CI |
| `topic/developer-tools` | 개발 생산성 도구 |
| `topic/terminal` | 터미널, 쉘 커스텀 |

## 아키텍처 / 패턴

| 태그 | 설명 |
|------|------|
| `topic/architecture` | 서버 아키텍처, 레이어드 구조 |
| `topic/DDD` | 도메인 주도 설계 |
| `topic/async` | 비동기 처리 |
| `topic/auth` | 인증·인가 |
| `topic/oauth` | OAuth 2.0 |
| `topic/cors` | CORS 설정 |

## 플랫폼 / OS

| 태그 | 설명 |
|------|------|
| `topic/macos` | macOS 팁 |
| `topic/windows` | Windows 설정 |
| `topic/ios` | iOS 개발 환경 |
| `topic/android` | Android 개발 환경 |

## 기타

| 태그 | 설명 |
|------|------|
| `topic/AI` | AI 도구, LLM |
| `topic/openai` | OpenAI API |
| `topic/product` | 프로덕트, 서비스 운영 |
| `topic/analytics` | 지표, 분석 |
| `topic/productivity` | 생산성 도구 |
## type 태그 (글 유형)

| 태그 | 설명 |
|------|------|
| `type/note` | 학습·트러블슈팅 기록 (가장 일반적) |
| `type/log` | 사건·경험 기록 (장애, 트래픽 변화 등) |
| `type/idea` | 아이디어·고찰 |

---

## Claude의 신규 태그 추가 절차

`tag-curator` 스킬이 다음을 수행:

1. 카테고리 결정 (위 9개 + type 중 의미 매칭, 없으면 새 카테고리 신설)
2. 이 파일의 해당 섹션 표에 `| \`topic/X\` | 설명 |` 행 추가
3. `blog/index.md` `tags:` 배열에 `  - topic/X` 추가 (이 파일의 카테고리 순서대로 정렬)
4. 카테고리가 새로 생긴 경우 사용자에게 1줄 보고