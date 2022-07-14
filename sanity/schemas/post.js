/* eslint-disable import/no-anonymous-default-export */
export default {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "ingress",
      title: "Ingress",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    },
    // {
    //   name: "publishedAt",
    //   title: "Published at",
    //   type: "datetime",
    // },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "youtubeVideo",
      title: "Youtube Video Code",
      type: "string",
      validation: (Rule) => [Rule.min(11, "Min 11 characters"), Rule.max(11, "Max 11 characters")],
    },
    {
      name: "fireReactions",
      title: "Fire reactions",
      type: "number",
      initialValue: 0,
      hidden: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "surprisedReactions",
      title: "Surprised reactions",
      type: "number",
      initialValue: 0,
      hidden: true,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "mehReactions",
      title: "Meh reactions",
      type: "number",
      initialValue: 0,
      hidden: true,
      validation: (Rule) => Rule.required(),
    },
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      });
    },
  },
};
