import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({
        base: './src/pages',
        pattern: '**/[!_]*.md',
        generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        date: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        heroImage: z.string().optional(),
        thumbnailImage: z.string().optional(),
        subCategory: z.string().optional(),
        hide: z.boolean().default(false),
        draft: z.boolean().default(false),
        isCategory: z.boolean().default(false),
        layout: z.string(),
    }),
});

export const collections = { posts };
