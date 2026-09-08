import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

export async function GET() {
    const fixedRoutes = ['/', '/about/', '/daily/', '/env/', '/log/essay/', '/log/music/', '/log/reading/', '/projects/OFDM/', '/study/design/', '/study/reference/'];
    const posts = await getCollection('posts', ({ data }) => !data.isCategory && !data.hide && !data.draft);
    const routes = [...fixedRoutes, ...posts.map((post) => `/${post.id.replace(/\.md$/, '')}/`)];
    const urls = [...new Set(routes)].map((route) => `<url><loc>${new URL(route, SITE.url)}</loc></url>`).join('');

    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
}
