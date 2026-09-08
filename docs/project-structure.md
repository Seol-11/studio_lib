# 프로젝트 구조

## 전체 구조

```text
studio_lib/
├── .github/
│   ├── dependabot.yml          의존성 업데이트 설정
│   └── workflows/verify.yml    GitHub Actions 검증
├── docs/                       운영자 문서와 글 템플릿
├── public/                     가공 없이 그대로 배포되는 정적 파일
│   ├── data/daily-logs.json    Daily Log 데이터
│   ├── images/                 게시글·사이트 이미지
│   ├── _headers                Cloudflare 응답 헤더
│   └── robots.txt              검색 로봇 안내
├── scripts/
│   └── validate-build.mjs      빌드 결과 자동 검증
├── src/
│   ├── components/             재사용 UI
│   ├── config/site.ts          사이트·Giscus 설정
│   ├── layouts/                공통 페이지 레이아웃
│   ├── pages/                  URL 페이지와 Markdown 콘텐츠
│   ├── styles/style_config.css 전역 디자인 토큰·Markdown 스타일
│   ├── utils/                  게시글과 페이지네이션 공통 로직
│   └── content.config.ts       Markdown frontmatter 스키마
├── astro.config.mjs            Astro 빌드 설정
├── package.json                명령과 의존성
└── tsconfig.json               TypeScript 및 `~/` 별칭 설정
```

`dist/`, `.astro/`, `node_modules/`는 생성물입니다. 직접 수정하거나 Git에 커밋하지 않습니다.

## `src/pages`: URL과 콘텐츠

Astro의 파일 기반 라우팅을 사용합니다. 예를 들어 `src/pages/study/design/uart.md`는 `/study/design/uart`가 됩니다.

- `index.astro`: 전체 글 목록인 홈
- `about.astro` + `_about.md`: About 화면과 편집 가능한 본문
- `daily.astro`: JSON 기반 짧은 로그 화면
- `404.astro`: 존재하지 않는 주소
- `rss.xml.ts`: 공개 글 RSS
- `sitemap.xml.ts`: 검색엔진용 URL 목록
- `search.json.ts`: 헤더 검색창이 지연 로딩하는 검색 색인
- `_categories.ts`: 좌측 사이드바와 게시글 카테고리 판별의 단일 기준
- `_blog-index.md`: 홈 소개 문구
- `_`로 시작하는 파일: 보조 데이터이며 콘텐츠 컬렉션에서 제외
- 각 카테고리의 `index.md`: `CategoryLayout`을 사용하는 목록 페이지
- 그 밖의 Markdown: `BlogPostLayout`을 사용하는 실제 게시글

## 레이아웃 관계

```text
BaseLayout
└── BlogLayout
    ├── Header
    ├── BlogSidebar
    ├── 중앙 콘텐츠
    │   ├── CategoryLayout + PostList
    │   └── BlogPostLayout + GiscusComments + PostList
    └── 우측 ON_THIS_PAGE 목차
```

- `BaseLayout.astro`: HTML 문서, SEO·공유 메타데이터, 테마, 공통 스타일, Daily Log 위젯
- `BlogLayout.astro`: 좌측 사이드바·중앙 본문·우측 목차의 3열 구조
- `CategoryLayout.astro`: 현재 카테고리의 글을 모아 날짜순으로 출력
- `BlogPostLayout.astro`: 제목, 날짜, 태그, 선택적 hero 이미지, 본문, 댓글, 관련 글

Astro의 클라이언트 라우터와 `transition:persist`를 사용해 페이지 이동 중 좌측 사이드바와 Daily Log 위젯 상태를 유지합니다.

## 주요 컴포넌트

- `Header.astro`: 상단 메뉴, 다크 모드, 검색 모달. Fuse.js는 검색을 처음 열 때만 로드
- `BlogSidebar.astro`: 프로필, 음악 위젯, 카테고리. 접힘 상태와 애니메이션 상태를 `localStorage`에 저장
- `PostList.astro`: 목록, 하위 카테고리 필터, 태그 필터, 검색, 페이지네이션, 썸네일
- `GiscusComments.astro`: GitHub Discussions 기반 댓글과 테마 동기화
- `LogWidget.astro`: `daily-logs.json`의 첫 항목을 표시하는 고정 위젯

## 게시글 데이터 흐름

1. `src/content.config.ts`가 `src/pages/**/*.md`를 읽고 frontmatter를 검증합니다.
2. `src/utils/posts.ts`가 URL 변환, 공개 여부 필터, 날짜 정렬을 공통 처리합니다.
3. 홈과 카테고리에서 `PostList`가 결과를 표시합니다.
4. `search.json.ts`, `rss.xml.ts`, `sitemap.xml.ts`가 같은 콘텐츠 컬렉션으로 배포 데이터를 만듭니다.

이 구조 때문에 frontmatter 오타나 잘못된 자료형은 `npm run check` 단계에서 발견됩니다.

## 정적 파일과 캐시

`public/`의 파일은 빌드 시 루트 경로로 복사됩니다. 예를 들어 `public/images/photo.webp`는 사이트에서 `/images/photo.webp`입니다. `_astro` 빌드 자산은 `public/_headers` 설정에 따라 장기 캐시되며 파일명 해시가 바뀔 때 안전하게 갱신됩니다.
