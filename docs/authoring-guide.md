# 글 작성 가이드

## 1. 글을 저장할 위치

Markdown 파일의 경로가 그대로 URL이 됩니다.

| 글 종류 | 저장 폴더 | URL 예시 |
| --- | --- | --- |
| 에세이 | `src/pages/log/essay/` | `/log/essay/my-note` |
| 음악 | `src/pages/log/music/` | `/log/music/album-review` |
| 독서 | `src/pages/log/reading/` | `/log/reading/book-title` |
| RTL 설계 | `src/pages/study/design/` | `/study/design/uart-rx` |
| 참고 자료 | `src/pages/study/reference/` | `/study/reference/tool-list` |
| OFDM 프로젝트 | `src/pages/projects/OFDM/` | `/projects/OFDM/synchronizer` |
| 환경 설정 | `src/pages/env/` | `/env/tool-setup` |

파일명은 URL의 일부이므로 `영문 소문자-하이픈.md` 형식을 권장합니다. 이미 공개한 파일의 이름이나 위치를 바꾸면 기존 링크와 Giscus 댓글 연결이 끊길 수 있습니다.

각 카테고리의 `index.md`는 목록 화면 자체입니다. 일반 게시글로 덮어쓰거나 삭제하지 않습니다.

## 2. 새 글 만들기

`docs/post-template.md`를 대상 폴더에 복사한 뒤 파일명과 frontmatter를 수정합니다.

```yaml
---
layout: ~/layouts/BlogPostLayout.astro
title: "UART 수신기 설계"
description: "오버샘플링 기반 UART 수신기의 구조와 RTL 구현을 정리합니다."
date: "2026-09-08"
tags: [rtl, uart, verilog]
thumbnailImage: /images/posts/uart-rx-thumbnail.webp
# heroImage: /images/posts/uart-rx-hero.webp
draft: true
---
```

본문 첫 제목은 레이아웃이 자동으로 만들기 때문에 Markdown은 `##`부터 시작하는 것을 권장합니다. `##`~`####` 제목은 우측 `ON_THIS_PAGE` 목차에 자동으로 나타납니다.

읽기 편한 본문을 위해 다음 형식을 권장합니다.

- 문단 사이에는 빈 줄을 하나 넣고, 한 문단에 서로 다른 주제를 몰아넣지 않습니다.
- 제목은 `##` → `###` → `####` 순서를 건너뛰지 않습니다.
- 코드 블록에는 `verilog`, `system-verilog`, `python`, `sh`처럼 언어를 지정합니다.
- 긴 절차는 번호 목록, 병렬적인 항목은 글머리표 목록을 사용합니다.
- 표는 정확한 비교가 필요할 때만 사용하고 긴 설명은 일반 문단으로 작성합니다.
- 링크 문구는 “여기”보다 대상 내용을 알 수 있는 이름으로 작성합니다.

## 3. frontmatter 필드

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `layout` | 필수 | 일반 글은 항상 `~/layouts/BlogPostLayout.astro` |
| `title` | 필수 | 목록, 본문, 검색 및 공유 메타데이터에 표시되는 제목 |
| `description` | 선택 | 목록 요약, 검색 결과와 SEO 설명. 한두 문장을 권장 |
| `date` | 선택 | `YYYY-MM-DD` 형식. 목록은 최신 날짜순 정렬 |
| `tags` | 선택 | YAML 배열. 예: `[astro, blog]` |
| `thumbnailImage` | 선택 | 글 목록에만 표시하는 작은 이미지 |
| `heroImage` | 선택 | 본문 상단 및 Open Graph 공유 이미지에 표시 |
| `draft` | 선택 | `true`면 목록·검색·피드에서 제외되고 프로덕션 접근은 404로 이동 |
| `hide` | 선택 | 목록·검색·피드에서는 숨기되 직접 URL 접근은 유지 |
| `subCategory` | 선택 | 한 카테고리 내부 필터 그룹을 수동으로 지정할 때 사용 |
| `isCategory` | 카테고리만 | 카테고리 `index.md`에서만 `true`로 사용 |

생략된 `description`과 `tags`에는 빈 기본값이 적용되고, `hide`, `draft`, `isCategory`는 기본적으로 `false`입니다.

`hide`는 보안이나 비공개 기능이 아닙니다. URL을 아는 사람은 접근할 수 있으므로 민감한 내용은 저장소와 사이트에 올리지 마세요.

## 4. 이미지 사용

이미지는 `public/images/` 아래에 저장하고 Markdown/frontmatter에서는 `/images/...` 절대 경로로 참조합니다.

```text
public/images/posts/uart-rx-thumbnail.webp
                         ↓
thumbnailImage: /images/posts/uart-rx-thumbnail.webp
```

- `thumbnailImage`는 홈, 카테고리, 본문 아래 관련 글 목록에만 표시됩니다.
- `heroImage`는 본문 상단과 소셜 공유 이미지로 사용됩니다.
- 목록 썸네일만 원하면 `thumbnailImage`만 지정합니다.
- 본문 중간 이미지는 일반 Markdown 문법 `![대체 설명](/images/posts/example.webp)`을 사용합니다.
- 이미지 바로 다음 문단에 이탤릭 문장을 쓰면 캡션으로 표시됩니다.
- 사진과 일러스트는 WebP 또는 AVIF를 권장합니다.
- 썸네일은 16:10 또는 16:9 비율, 최소 560px 너비 정도면 충분합니다.
- 이미지 파일명도 영문 소문자와 하이픈을 사용하고, 사용하지 않는 이미지는 함께 정리합니다.

```md
![UART 수신 파형](/images/posts/uart-rx-waveform.webp)

*그림 1. Start bit 검출 이후의 샘플링 지점*
```

## 5. 공개와 숨김

작성 흐름은 다음이 가장 안전합니다.

1. 새 글을 `draft: true`로 작성합니다.
2. 개발 서버에서 데스크톱과 모바일 폭을 확인합니다.
3. 링크, 코드 블록, 이미지와 제목 계층을 확인합니다.
4. `npm run validate`를 실행합니다.
5. 공개 시 `draft: false`로 바꾸거나 해당 줄을 삭제합니다.

초안도 개발 서버에서는 직접 URL로 미리 볼 수 있습니다. 프로덕션 빌드에서는 글 주소가 생성될 수 있지만 접속 시 404로 이동하며, 홈·카테고리·검색·RSS·Sitemap에는 포함되지 않습니다.

## 6. 카테고리 추가

새 카테고리를 추가할 때는 세 곳을 함께 수정합니다.

1. 새 폴더와 `index.md` 생성
2. `src/pages/_categories.ts`에 사이드바 항목 추가
3. `src/pages/sitemap.xml.ts`의 `fixedRoutes`에 카테고리 URL 추가

카테고리 파일 예시:

```yaml
---
layout: ~/layouts/CategoryLayout.astro
title: "새 카테고리"
description: "카테고리 소개"
isCategory: true
---
```

카테고리 경로의 대소문자는 파일 시스템과 URL 전체에서 정확히 일치시켜야 합니다. 현재 `OFDM`은 대문자를 사용합니다.
