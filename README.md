# RSS-Notify-Me 📬

> RSS 피드를 모니터링하고 새로운 콘텐츠가 업데이트되면 Gmail로 알림을 보내는 자동화 도구

## Features

- **RSS 피드 모니터링**: 설정된 RSS 링크들을 확인
- **Gmail 알림**: 새 콘텐츠 발견 시 자동 이메일 발송
- **자동 실행**: GitHub Actions를 통한 cron 스케줄링 (1일 1회)

## Overview

관심 있는 블로그나 뉴스 사이트의 새로운 콘텐츠를 확인하면 설정한 주소로 이메일을 발송하는 것이 목표

## Usage

### 1. Settings

프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력:

```bash
# RSS 피드 목록 (원하는 블로그/사이트의 RSS 링크)
RSS_FEED_URLS=https://blog1.com/rss.xml,https://blog2.com/feed,https://news.com/rss

# Gmail 설정
GOOGLE_USER=your-email@gmail.com
GOOGLE_APP_PASSWORD=your-app-password

# 이메일 발신/수신자
MAIL_FROM=your-email@gmail.com
MAIL_TO=your-email@email.com

# JSONBin 설정
JSONBIN_BIN_ID=your-binio-bin-id
JSONBIN_ACCESS_KEY=your-binio-api-key
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 로컬 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build
node dist/index.js
```

## Configuration

### Gmail 앱 비밀번호 생성

1. Google 계정 설정 → 보안
2. 2단계 인증 활성화
3. 앱 비밀번호 생성 (메일 → 기타)
4. 생성된 16자리 비밀번호를 `GOOGLE_APP_PASSWORD`에 입력

### JSONBin.io 설정

1. [JSONBin.io](https://jsonbin.io) 가입
2. 새 bin 생성
3. Bin ID와 Access Key 복사 (READ, WRITE 권한 필요)
4. `.env` 파일에 입력

#### JSONBin 초기 데이터 구조

초기 설정 시 다음과 같은 빈 JSON 구조로 시작:

```json
{}
```

첫 실행되면 자동으로 다음과 같은 구조로 데이터가 생성:

```json
{
  "https://example.com/rss.xml": {
    "links": [],
    "lastChecked": 0
  },
  "https://another-blog.com/feed": {
    "links": [],
    "lastChecked": 0
  }
}
```

- `links`: 해당 피드에서 읽은 기사 링크들의 배열 (최대 20개, 수정 가능)
- `lastChecked`: 마지막으로 확인한 시간 (Unix timestamp)

### RSS 링크 찾기

- 블로그 주소 뒤 `/rss`, `/feed`, `/rss.xml` 추가
- 블로그 소스코드 중 `<link rel="alternate" type="application/rss+xml">` 찾기
- 직접 접속하여 RSS 피드 확인

## GitHub Actions

### Workflows Setting

`.github/workflows/rss-notify.yml` 파일이 이미 포함

### Secrets Setting

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 값 추가:

- `GOOGLE_USER`
- `GOOGLE_APP_PASSWORD`
- `MAIL_FROM`
- `MAIL_TO`
- `RSS_FEED_URLS`
- `JSONBIN_BIN_ID`
- `JSONBIN_ACCESS_KEY`

### 실행 스케줄

- **자동 실행**: 매일 UTC 00:00 (한국 시간 09:00) - 하루 1회
- **수동 실행**: GitHub Actions의 "Run workflow"로 즉시 실행

## Structure

```
src/
├── config/          # 환경변수 및 설정
├── core/            # 로직 (RSS 읽기, 알림 발송)
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 함수 (JSONBin 통신, 로깅)
```

## RSS Feed Examples

```bash
# 기술 블로그
https://blog.logrocket.com/feed/
https://css-tricks.com/feed/
https://dev.to/feed/

# 뉴스 사이트
https://feeds.bbci.co.uk/news/rss.xml
https://rss.cnn.com/rss/edition.rss
https://feeds.npr.org/1001/rss.xml

# 개발자 뉴스
https://feeds.feedburner.com/geeknews-feed
https://news.ycombinator.com/rss
https://feeds.feedburner.com/TechCrunch/

# GitHub 릴리즈
https://github.com/nodejs/node/releases.atom
https://github.com/microsoft/vscode/releases.atom
```
