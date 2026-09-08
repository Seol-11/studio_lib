# Studio.lib 운영 문서

이 디렉터리는 블로그를 실제로 작성하고 운영할 때 필요한 기준을 모아 둔 문서입니다. 처음에는 아래 순서로 읽으면 됩니다.

1. [글 작성 가이드](authoring-guide.md): 새 글, 이미지, 초안, 숨김 처리
2. [프로젝트 구조](project-structure.md): 각 폴더와 주요 파일의 역할
3. [운영 및 배포 가이드](operations-guide.md): 개발 서버, 검증, Cloudflare Pages 배포
4. [게시글 템플릿](post-template.md): 새 Markdown 파일을 만들 때 복사할 원본

## 가장 자주 하는 작업

### 새 글 작성

1. 글 성격에 맞는 카테고리 폴더를 고릅니다. 예: `src/pages/study/design/`
2. `docs/post-template.md`를 복사해 영문 소문자와 하이픈으로 파일명을 정합니다. 예: `uart-receiver.md`
3. 작성 중에는 `draft: true`를 유지합니다.
4. `npm run dev`로 확인하고 `npm run validate`를 통과시킵니다.
5. 공개할 때 `draft: false`로 변경하거나 `draft` 줄을 제거합니다.

### 짧은 Daily Log 추가

`public/data/daily-logs.json` 배열 맨 앞에 최신 항목을 추가합니다. 첫 항목은 모든 페이지 우측 하단의 Daily Log 위젯에도 표시됩니다.

```json
[
  { "date": "2026-09-08", "content": "오늘의 짧은 기록" },
  { "date": "2026-05-25", "content": "기존 기록" }
]
```

JSON에서는 마지막 항목 뒤에 쉼표를 붙이지 않습니다.

### 사이트 정보 변경

- 사이트 이름, 설명, 주소, 작성자: `src/config/site.ts`의 `SITE`
- 댓글 저장소와 카테고리: `src/config/site.ts`의 `GISCUS`
- 사이드바 카테고리: `src/pages/_categories.ts`
- About 내용: `src/pages/_about.md`
- 홈 소개 문구: `src/pages/_blog-index.md`
- 사이드바 프로필 이미지: `public/images/sidebar-profile.jpg`

## 공개 전 최소 체크

```sh
npm run validate
```

이 명령 하나로 타입 검사, 정적 빌드, 내부 경로, 메타데이터, 검색 색인, RSS와 Sitemap을 확인합니다. 실패한 상태로 배포하지 않는 것을 운영 원칙으로 삼습니다.
