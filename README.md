# General Blog

A Markdown blog built with Eleventy for GitHub Pages. The article and archive layouts are based on [Matthew Butterick’s Chron](https://matthewbutterick.com/chron/layers-of-lawyers-and-liars.html). The supplied typography manual informed the reading measure, semantic markup, punctuation, and link treatment.

## Write and preview

With Node.js 22 or later, run these commands from this directory:

```sh
npm ci
npm run new -- "The title of your essay"
npm start
```

The first command installs the locked dependencies. The second creates a dated draft in `src/posts/` and prints its path. Open the localhost URL printed by the third command. The preview rebuilds as you save. Both included posts are sample drafts.

Each post is one Markdown file. Its opening paragraph automatically gets the larger type. Start sections with `##` and subsections with `###`. Section headings get their own links. Use `>` for block quotations, `[^note]` for footnotes, and `## Update · 10 November 2026` for a ruled update. Save post images in `src/assets/media/` and reference them with `![Description of the image](/assets/media/file.jpg)`.

The renderer converts straight quotation marks, `--`, `---`, and `...` in prose. Use literal `′` and `″` for measurements and backticks for code. Use curly punctuation directly in the title and description. The filename determines the article URL, so keep it stable after publication.

## Publish

1. Set `draft: false` and the publication date in the post’s front matter. Use `YYYY-MM-DD`. A post without an explicit `draft: false` stays out of the published build. A public GitHub repository still exposes its source files, so keep private drafts on your device until they are ready.
2. Run `npm run build` to generate the deployable site in `_site/`. The local preview has its own output directory.
3. Put this directory’s contents at the root of the GitHub repository on `main`. In the repository’s **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow builds and deploys each push to `main`. It reads the Pages base path automatically, including when the site is served beneath the repository name. [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Site details

Edit `src/_data/site.json` for the name, description, and language. The typography and responsive layout live in `src/assets/blog.css`. The site hosts [Fira Sans from Google Fonts](https://fonts.google.com/specimen/Fira+Sans) locally for titles, navigation, and article text. Its Open Font License accompanies the built files.
