export async function GET() {
  // 모든 마크다운 파일을 가져옵니다.
  const posts = import.meta.glob('./**/*.md', { eager: true });
  
  const searchIndex = Object.values(posts)
    .filter((post) => {
      if (post.file && post.file.endsWith('_blog-index.md')) return false;
      if (post.frontmatter && post.frontmatter.isCategory) return false;
      return true;
    })
    .map((post) => {
      return {
        title: post.frontmatter.title || 'Untitled',
        description: post.frontmatter.description || '',
        url: post.url,
        date: post.frontmatter.date || '',
        tags: post.frontmatter.tags || []
      };
    });
  
  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
