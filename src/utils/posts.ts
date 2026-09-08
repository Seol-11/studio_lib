import { categories } from '../pages/_categories';
import type { CollectionEntry } from 'astro:content';

export interface PostFrontmatter {
    title?: string;
    description?: string;
    date?: string | Date;
    tags?: string[];
    heroImage?: string;
    thumbnailImage?: string;
    subCategory?: string;
    isCategory?: boolean;
    hide?: boolean;
    draft?: boolean;
}

export interface MarkdownPost {
    file: string;
    url: string;
    frontmatter: PostFrontmatter;
    subCategory?: string | null;
}

export const categoryPaths = categories.flatMap((category) =>
    category.type === 'folder' ? category.items.map(({ path }) => normalizePath(path)) : [],
);

export function normalizePath(path: string): string {
    return path.replace(/\/+$/, '') || '/';
}

export function getCategoryPath(url?: string): string | null {
    if (!url) return null;
    const pathname = normalizePath(url);
    return categoryPaths
        .filter((categoryPath) => pathname === categoryPath || pathname.startsWith(`${categoryPath}/`))
        .sort((a, b) => b.length - a.length)[0] ?? null;
}

export function isPublishedPost(post: MarkdownPost): boolean {
    const filename = post.file.split('/').pop() ?? '';
    return !filename.startsWith('_') && !post.frontmatter.isCategory && !post.frontmatter.hide && !post.frontmatter.draft && Boolean(post.frontmatter.title);
}

export function sortPostsByDate(posts: MarkdownPost[]): MarkdownPost[] {
    return [...posts].sort((a, b) =>
        new Date(b.frontmatter.date ?? 0).getTime() - new Date(a.frontmatter.date ?? 0).getTime(),
    );
}

export function collectionEntryToPost(entry: CollectionEntry<'posts'>): MarkdownPost {
    const pathname = entry.id.replace(/\.md$/, '').replace(/\/index$/, '');
    return {
        file: entry.filePath ?? entry.id,
        url: `/${pathname}`,
        frontmatter: entry.data,
    };
}
