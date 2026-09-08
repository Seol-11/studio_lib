# Studio.lib

전자공학, RTL 설계, OFDM 프로젝트와 일상 기록을 정리하는 Astro 기반 개인 블로그입니다.

- 운영 사이트: <https://studio-lib.pages.dev>
- 프레임워크: Astro 5
- 배포 환경: Cloudflare Pages
- 댓글: Giscus
- RSS: <https://studio-lib.pages.dev/rss.xml>
- Sitemap: <https://studio-lib.pages.dev/sitemap.xml>

## 개발

```sh
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:4321`에서 열립니다.

## 검증 및 빌드

All commands are run from the root of the project, from a terminal:

```sh
npm run check
npm run build
npm run validate
npm run preview
```

## 문서

운영자용 전체 사용 설명서는 [`docs/README.md`](docs/README.md)에서 시작합니다.

- 글 작성과 이미지: [`docs/authoring-guide.md`](docs/authoring-guide.md)
- 폴더 및 코드 구조: [`docs/project-structure.md`](docs/project-structure.md)
- 로컬 실행, 검증, 배포: [`docs/operations-guide.md`](docs/operations-guide.md)
- 새 글 복사용 원본: [`docs/post-template.md`](docs/post-template.md)

## 콘텐츠 구조

- `src/pages/log`: 에세이, 음악, 독서
- `src/pages/study`: RTL 설계 및 참고 자료
- `src/pages/projects`: 프로젝트 기록
- `src/pages/env`: 개발 환경 및 도구 설정
- `public/data/daily-logs.json`: 짧은 일상 로그
- `src/content.config.ts`: Markdown frontmatter 스키마
- `src/config/site.ts`: 사이트와 Giscus 공통 설정
- `docs/post-template.md`: 새 게시글 템플릿

일반 글은 해당 카테고리 아래에 Markdown 파일로 추가합니다. 카테고리 페이지는 frontmatter의 `isCategory: true`로 목록에서 제외됩니다. `hide: true`인 글은 목록과 검색 색인에서 숨겨지며, `draft: true`인 글은 프로덕션에서 404로 이동합니다.

이미지는 용도별로 분리합니다. `thumbnailImage`는 홈·카테고리·관련 글 목록의 썸네일에만 사용하고, `heroImage`는 글 본문 상단과 공유 메타데이터에 사용합니다. 목록 썸네일만 필요한 글에는 `thumbnailImage`만 지정하면 됩니다.

`npm run validate`는 타입 검사, 프로덕션 빌드, 생성된 HTML·RSS·Sitemap·로컬 에셋 검증을 한 번에 실행합니다. GitHub Actions에서도 같은 검증을 수행합니다.
