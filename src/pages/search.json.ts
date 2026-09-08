import { getCollection } from 'astro:content';

export async function GET() {
    const posts = await getCollection('posts', ({ data }) =>
        !data.isCategory && !data.hide && !data.draft && Boolean(data.title),
    );
    const searchIndex = posts
        .map(({ id, data }) => ({
            title: data.title,
            description: data.description,
            url: `/${id.replace(/\.md$/, '').replace(/\/index$/, '')}`,
            date: data.date?.toISOString().slice(0, 10) ?? '',
            tags: data.tags,
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

    return new Response(JSON.stringify(searchIndex), {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
