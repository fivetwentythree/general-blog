const preview = () => process.env.ELEVENTY_RUN_MODE === "serve";
const isPrivate = (data) => data.draft !== false && !preview();

export default {
  layout: "post.njk",
  tags: ["posts"],
  draft: true,
  eleventyComputed: {
    permalink: (data) => isPrivate(data) ? false : `/writing/${data.page.fileSlug}.html`,
    eleventyExcludeFromCollections: (data) => isPrivate(data),
  },
};
