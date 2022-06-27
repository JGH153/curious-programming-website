import { Comment } from "../shared/comment.interface";

// input for my name? update on local storage changed?
export function CommentList(props: { postId: string; comments: Comment[] }) {
  // const comments: Comment[] = [
  //   { comment: "This is a comment1", author: "John Doe" },
  //   { comment: "This is a comment2", author: "Greger" },
  //   { comment: "This is a comment3", author: "John Doe" },
  // ];

  const ownAuthorName = "Greger";

  // TODO timestamp as well
  const getComment = (comment: Comment) => {
    if (comment.author === ownAuthorName) {
      return (
        <div
          className="flex justify-end flex-col items-end"
          key={comment._id}
        >
          <div className="pr-3 py-1">
            {comment.author} (at {comment.postedDate}):
          </div>
          <div className="rounded-3xl bg-chat-blue px-3 py-2 w-max max-w-fit">{comment.body}</div>
        </div>
      );
    } else {
      return (
        <div
          className=""
          key={comment._id}
        >
          <div className="pl-3 py-1">
            {comment.author} (at {comment.postedDate}):
          </div>
          <div className="rounded-3xl bg-chat-dark px-3 py-2 w-max  w-max max-w-fit">{comment.body}</div>
        </div>
      );
    }
  };

  return (
    <div className="mt-16">
      <h1 className="text-3xl font-bold">Comments:</h1>
      <div className="">{props.comments.map((comment) => getComment(comment))}</div>
    </div>
  );
}
