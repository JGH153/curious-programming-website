import { useEffect, useState } from "react";
import { Comment } from "../shared/comment.interface";
import { DisplayDate } from "./DisplayDate";

export function CommentList(props: { postId: string; comments: Comment[]; myUserName: string }) {
  // TODO format comment date (new component)
  const getComment = (comment: Comment) => {
    if (comment.author === props.myUserName) {
      return (
        <div
          className="flex justify-end flex-col items-end"
          key={comment._id}
        >
          <div className="pr-3 py-1">
            {comment.author} (at <DisplayDate date={comment.postedDate} />
            ):
          </div>
          <div className="rounded-3xl whitespace-pre bg-chat-blue px-3 py-2 w-max max-w-fit">{comment.body}</div>
        </div>
      );
    } else {
      return (
        <div
          className=""
          key={comment._id}
        >
          <div className="pl-3 py-1">
            {comment.author} (at <DisplayDate date={comment.postedDate} />
            ):
          </div>
          <div className="rounded-3xl whitespace-pre bg-chat-dark px-3 py-2 w-max max-w-fit">{comment.body}</div>
        </div>
      );
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold text-center">Comments:</h1>
      {props.comments.length === 0 && <h2 className="text-center text-xl">No comments yet</h2>}
      <div className="">{props.comments.map((comment) => getComment(comment))}</div>
    </div>
  );
}
