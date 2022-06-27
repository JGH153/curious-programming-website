export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "postId",
      title: "PostID",
      type: "string",
    },
    {
      name: "author",
      title: "Author",
      type: "string",
    },
    {
      name: "approved",
      title: "Approved",
      type: "boolean",
    },
    {
      name: "body",
      title: "Body",
      type: "text", // TODO blockContent
    },
  ],

  preview: {
    select: {
      title: "author",
      approved: "approved",
    },
    prepare(selection) {
      const { approved } = selection;
      return {
        ...selection,
        subtitle: `${approved ? "Approved" : "Not approved"}`,
      };
    },
  },
};
