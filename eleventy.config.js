import { rm } from "node:fs/promises";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import footnote from "markdown-it-footnote";
import site from "./src/_data/site.json" with { type: "json" };
import { slugify } from "./scripts/slug.mjs";

const dateFormatter = new Intl.DateTimeFormat(site.language, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const pathPrefix = process.env.PAGES_BASE_PATH || "/";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.setServerOptions({
    domDiff: false,
    middleware: [(request, response, next) => {
      const local = ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(request.socket.remoteAddress);
      if (local) return next();
      response.writeHead(403).end("The preview is available on this device.");
    }],
  });

  const markdown = markdownIt({ html: true, typographer: true })
    .use(footnote)
    .use(anchor, {
      level: [2, 3, 4, 5, 6],
      tabIndex: false,
      slugify: (heading) => slugify(heading) || "section",
      permalink: anchor.permalink.headerLink(),
    });

  const footnoteBackref = markdown.renderer.rules.footnote_anchor;
  markdown.renderer.rules.footnote_anchor = (...args) =>
    footnoteBackref(...args).replace("<a ", '<a aria-label="Back to footnote reference" ');

  markdown.renderer.rules.table_open = () =>
    '<div class="table-scroll" role="region" aria-label="Table" tabindex="0"><table>\n';
  markdown.renderer.rules.table_close = () => "</table></div>\n";
  eleventyConfig.setLibrary("md", markdown);

  eleventyConfig.addFilter("displayDate", (date) => dateFormatter.format(date));
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));

  eleventyConfig.addPassthroughCopy("src/assets");

  const fira = "node_modules/@fontsource/fira-sans";
  eleventyConfig.addPassthroughCopy({
    [`${fira}/files/fira-sans-latin-400-normal.woff2`]: "assets/fonts/fira-sans.woff2",
    [`${fira}/files/fira-sans-latin-400-italic.woff2`]: "assets/fonts/fira-sans-italic.woff2",
    [`${fira}/files/fira-sans-latin-600-normal.woff2`]: "assets/fonts/fira-sans-semibold.woff2",
    [`${fira}/files/fira-sans-latin-600-italic.woff2`]: "assets/fonts/fira-sans-semibold-italic.woff2",
    [`${fira}/LICENSE`]: "assets/fonts/fira-sans-LICENSE.txt",
  });

  // A post returned to draft must disappear from subsequent production builds.
  eleventyConfig.on("eleventy.before", async ({ dir, runMode, outputMode }) => {
    if (runMode === "build" && outputMode === "fs" && dir.output === "_site") {
      await rm(dir.output, { recursive: true, force: true });
    }
  });
}

export const config = {
  dir: { input: "src", output: "_site" },
  pathPrefix,
  markdownTemplateEngine: false,
};
