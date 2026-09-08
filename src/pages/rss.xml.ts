import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
})[character] ?? character);

export async function GET() {
    const posts = (await getCollection('posts', ({ data }) => !data.isCategory && !data.hide && !data.draft))
        .sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));
    const items = posts.map((post) => {
        const url = new URL(`/${post.id.replace(/\.md$/, '')}/`, SITE.url);
        return `<item><title>${escapeXml(post.data.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXml(post.data.description)}</description>${post.data.date ? `<pubDate>${post.data.date.toUTCString()}</pubDate>` : ''}</item>`;
    }).join('');

    return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(SITE.name)}</title><link>${SITE.url}</link><description>${escapeXml(SITE.description)}</description><language>ko-KR</language>${items}</channel></rss>`, {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
}
