/* eslint-disable import/no-anonymous-default-export */
export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "postId",
      title: "PostID",
      type: 'reference',
      to: [{type: 'post'}]
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
      type: "text",
    },
  ],

  initialValue: {
    approved: false,
  },

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
