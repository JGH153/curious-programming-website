import { useState } from "react";
import { httpClient } from "../shared/httpClient";
import { ButtonGradient } from "./ButtonGradient";
import { InputMarkdown } from "./InputMarkdown";

export function NewComment(props: { postId: string }) {
  const [loading, isLoading] = useState(false);

  const onSubmit = async (form: React.FormEvent<HTMLFormElement>) => {
    // TODO spinner
    form.preventDefault();
    isLoading(true);
    const response = await httpClient.post("/api/comment", { comment: comment });
    if (response.status === 200) {
      // TODO notification
    } else {
      console.error(response.body);
    }
    isLoading(false);
  };

  const [comment, setComment] = useState("");

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <h1 className="mt-10 text-3xl font-bold">New Comment on {props.postId}:</h1>
        {/* TODO improve */}
        {loading && <div>loading</div>}
        {/* <InputMarkdown /> */}
        <textarea
          className="w-full h-40 p-2 my-4 text-black"
          onChange={(event) => setComment(event.target.value)}
        ></textarea>

        {/* TODO disabled if no text */}
        <ButtonGradient disabled={comment.length === 0}>Add</ButtonGradient>
      </form>
    </div>
  );
}
