import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { slugify } from "./slug.mjs";

const title = process.argv.slice(2).join(" ").trim();
const slug = slugify(title);

if (!slug || Buffer.byteLength(slug) > 200) {
  console.error('Usage: npm run new -- "A short post title with letters or numbers"');
  process.exit(1);
}

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const post = new URL(`../src/posts/${slug}.md`, import.meta.url);

try {
  await writeFile(post, `---
title: ${JSON.stringify(title)}
date: "${year}-${month}-${day}"
draft: true
---

Write the opening paragraph here.

## First section

Continue the post here.
`, { flag: "wx" });
  console.log(fileURLToPath(post));
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.error(`A post already uses the slug “${slug}”. Edit that file or use another title.`);
  process.exitCode = 1;
}
