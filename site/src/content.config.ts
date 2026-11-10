import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive(),
    group: z.enum(["software", "embedded"]),
    category: z.string(),
    status: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
    repo: z.url().optional(),
  }).refine(({ image, imageAlt, imageWidth, imageHeight }) => !image || Boolean(imageAlt && imageWidth && imageHeight),
    "Project images require alt text and dimensions."),
});

export const collections = { projects };
