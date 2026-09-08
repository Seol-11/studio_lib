# 운영 및 배포 가이드

## 요구 환경

- Node.js 22 권장: GitHub Actions와 같은 버전
- npm: `package-lock.json`을 기준으로 의존성 고정

처음 내려받은 뒤:

```sh
npm ci
npm run dev
```

개발 서버 기본 주소는 `http://localhost:4321`입니다.

## 명령어

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 수정 내용을 실시간으로 확인하는 개발 서버 |
| `npm run check` | Astro·TypeScript·콘텐츠 스키마 검사 |
| `npm run build` | `dist/`에 프로덕션 정적 사이트 생성 |
| `npm run preview` | 생성된 `dist/`를 로컬에서 확인 |
| `npm run validate` | 검사, 빌드, 결과물 검증을 한 번에 실행 |

일상적인 글 수정에는 `npm run dev`와 `npm run validate`만 기억해도 충분합니다.

## 권장 발행 절차

1. 작업 전 저장소를 최신 상태로 맞춥니다.
2. `draft: true` 상태로 글과 이미지를 추가합니다.
3. `npm run dev`에서 본문, 목록 썸네일, 다크 모드와 모바일 폭을 확인합니다.
4. 내부 링크와 이미지 경로를 확인합니다.
5. 공개할 글의 `draft`를 제거하거나 `false`로 바꿉니다.
6. `npm run validate`를 실행합니다.
7. 변경 내용을 커밋하고 배포 브랜치로 푸시합니다.
8. Cloudflare Pages 배포 완료 후 실제 URL, 검색, 댓글을 한 번 확인합니다.

## Cloudflare Pages 설정

이 프로젝트는 정적 Astro 사이트입니다.

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 22 권장
- Root directory: 저장소 루트

운영 주소가 바뀌면 아래 두 곳을 함께 수정합니다.

1. `astro.config.mjs`의 `site`
2. `src/config/site.ts`의 `SITE.url`

주소 변경 뒤에는 canonical URL, Open Graph URL, RSS와 Sitemap이 새 주소를 사용하는지 `npm run validate`로 확인합니다.

## 댓글 설정

댓글은 Giscus와 GitHub Discussions를 사용합니다. 저장소나 Discussions 카테고리를 바꾸면 `src/config/site.ts`의 `GISCUS` 값을 새 설정으로 교체합니다.

Giscus 매핑은 `pathname`이므로 공개된 글의 URL을 변경하면 기존 토론과 연결이 달라질 수 있습니다. 공개 후에는 파일 이동과 이름 변경을 가급적 피합니다.

## 검색, RSS와 Sitemap

- 헤더 검색: `/search.json`을 가져온 뒤 Fuse.js로 제목·태그·설명을 검색
- RSS: `/rss.xml`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`

`draft: true`, `hide: true`, 카테고리 페이지는 글 검색 색인과 피드에서 제외됩니다. 카테고리 URL은 Sitemap의 고정 경로 목록으로 관리합니다.

## 의존성 관리

Dependabot이 npm과 GitHub Actions 업데이트를 제안합니다. 업데이트는 바로 합치기보다 다음 순서로 확인합니다.

```sh
npm ci
npm run validate
```

`package-lock.json`은 반드시 함께 커밋합니다. 의존성을 수동으로 바꿀 때는 `package.json`만 직접 고치기보다 `npm install 패키지명` 또는 `npm uninstall 패키지명`을 사용해 잠금 파일을 동기화합니다.

## 장애 확인 순서

### 글이 목록에 나오지 않을 때

- 파일이 올바른 카테고리 폴더 안에 있는지 확인
- `draft: true`, `hide: true`, `isCategory: true`가 잘못 들어갔는지 확인
- 날짜와 frontmatter YAML 문법 확인
- `npm run check` 실행

### 이미지가 보이지 않을 때

- 파일이 `public/images/`에 실제로 존재하는지 확인
- 경로가 `/images/...`로 시작하는지 확인
- Linux 배포 환경에서는 파일명 대소문자가 정확히 일치해야 함
- 목록 이미지는 `thumbnailImage`, 본문 상단 이미지는 `heroImage`인지 확인

### 카테고리가 비거나 링크가 깨질 때

- 폴더 경로와 `src/pages/_categories.ts`의 `path`가 일치하는지 확인
- `index.md`에 `isCategory: true`와 `CategoryLayout`이 있는지 확인
- 대소문자와 하이픈을 확인

### 배포는 성공했지만 이전 화면이 보일 때

- Cloudflare 배포가 최신 커밋인지 확인
- 일반 새로고침 뒤에도 동일하면 브라우저 캐시를 비우고 확인
- `_astro` 파일은 장기 캐시되지만 해시 파일명이므로 정상 빌드에서는 새 자산으로 자동 전환됨

## 백업과 보안

- 글, 설정, 이미지 원본은 Git으로 관리합니다.
- `.env`와 `.env.production`은 Git에서 제외되어 있습니다.
- 비밀 키, 개인 토큰, 공개하면 안 되는 초안은 Markdown이나 `public/`에 저장하지 않습니다.
- `hide: true`는 비공개 기능이 아닙니다.
- `public/_headers`의 보안 헤더를 변경한 뒤에는 실제 배포 응답 헤더도 확인합니다.
