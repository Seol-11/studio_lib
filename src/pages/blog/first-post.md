---
layout: ../../layouts/BlogPostLayout.astro
title: "나의 첫 번째 블로그 포스트"
date: "2026-03-16"
description: "Astro를 이용해 마크다운 기반의 블로그를 세팅했습니다."
tags: ["log", "astro", "env"]
category: "env"
---

안녕하세요! 

이 글은 `src/pages/blog` 폴더에 마크다운(`.md`) 파일을 추가하여 자동으로 생성된 첫 번째 포스트입니다. `layout` 프론트매터(Frontmatter)를 지정해주면, 우리가 만든 `BlogPostLayout`을 통해 예쁘게 렌더링됩니다.

## 헤딩 테스트 (H2)
블로그 글을 작성할 때 이렇게 마크다운 문법을 사용할 수 있습니다.

### 인용문 테스트 (H3)
> 하드웨어 설계자의 작업실에 오신 것을 환영합니다!

## 코드 블록 테스트
```javascript
// 검색 기능도 잘 동작하는지 확인해보세요!
export async function GET() {
    console.log("검색 API 엔드포인트입니다.");
    return new Response(JSON.stringify({ message: "Hello!" }));
}
```

이제 이곳에 다양한 공부 노트와 일상 기록을 남겨보세요! 검색창(돋보기 아이콘)을 누르고 '마크다운'이라고 검색해보세요.
