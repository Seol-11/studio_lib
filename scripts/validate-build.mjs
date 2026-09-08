import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const requiredFiles = [
    'dist/index.html',
    'dist/404.html',
    'dist/rss.xml',
    'dist/sitemap.xml',
    'dist/robots.txt',
    'dist/_headers',
];

for (const file of requiredFiles) {
    if (!existsSync(file)) throw new Error(`Missing build output: ${file}`);
}

const htmlFiles = readdirSync('dist', { recursive: true })
    .filter((file) => file.endsWith('.html'))
    .map((file) => `dist/${file}`);

for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const marker of ['<title>', 'rel="canonical"', 'name="description"']) {
        if (!html.includes(marker)) throw new Error(`${marker} missing from ${file}`);
    }
    if (html.includes('i.pinimg.com')) throw new Error(`External Pinterest asset remains in ${file}`);
}

const routeExists = (pathname) => {
    if (pathname === '/') return existsSync('dist/index.html');
    const target = join('dist', decodeURIComponent(pathname).replace(/^\//, ''));
    return existsSync(target)
        || existsSync(`${target}.html`)
        || existsSync(join(target, 'index.html'));
};

const internalPaths = [];
for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        const pathname = match[1].split(/[?#]/)[0];
        if (pathname) internalPaths.push([file, pathname]);
    }
}

const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const rss = readFileSync('dist/rss.xml', 'utf8');
const searchIndex = JSON.parse(readFileSync('dist/search.json', 'utf8'));
for (const item of searchIndex) internalPaths.push(['dist/search.json', item.url]);
for (const xml of [['dist/sitemap.xml', sitemap], ['dist/rss.xml', rss]]) {
    for (const match of xml[1].matchAll(/https:\/\/studio-lib\.pages\.dev(\/[^<]*)/g)) {
        internalPaths.push([xml[0], match[1]]);
    }
}
for (const [source, pathname] of internalPaths) {
    if (!routeExists(pathname)) throw new Error(`Broken internal path in ${source}: ${pathname}`);
}

const home = readFileSync('dist/index.html', 'utf8');
if (/modulepreload[^>]+fuse/i.test(home)) {
    throw new Error('Fuse.js is being eagerly loaded on the home page');
}
const notFound = readFileSync('dist/404.html', 'utf8');
if (!notFound.includes('noindex, nofollow')) throw new Error('404 page must not be indexed');
console.log(`Validated ${htmlFiles.length} HTML files, ${searchIndex.length} searchable posts, feeds, metadata, and local assets.`);
