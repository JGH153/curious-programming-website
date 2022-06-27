import { useEffect, useState } from "react";
import { httpClient } from "../shared/httpClient";
import { ButtonGradient } from "./ButtonGradient";
import { LoadingSpinner } from "./LoadingSpinner";

// function useLocalStorage(key: string, initialValue: string): [string, (newValue: string) => void] {
//   const storedValue = localStorage.getItem(key) || initialValue;
//   const setValue = (newValue: string) => {
//     localStorage.setItem(key, newValue);
//   };

//   return [storedValue, setValue];
// }

export function NewComment(props: { postId: string }) {
  const [loading, isLoading] = useState(false);
  const localStorageKey = "author";

  const onSubmit = async (form: React.FormEvent<HTMLFormElement>) => {
    // TODO spinner
    form.preventDefault();
    isLoading(true);
    const response = await httpClient.post("/api/comment", { comment: comment, postId: props.postId, author });
    if (response.status === 200) {
      // TODO notification
      localStorage.setItem(localStorageKey, author);
      setComment("");
      console.log("clear");
    } else {
      console.error(response.body);
    }
    isLoading(false);
  };

  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const storedValue = localStorage.getItem(localStorageKey) || "";
    setAuthor(storedValue);
  }, []);

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <h1 className="mt-10 text-3xl font-bold">New Comment on {props.postId}:</h1>
        {/* TODO improve */}
        {loading && <LoadingSpinner />}
        {/* <InputMarkdown /> */}
        <input
          type="text"
          className="text-black mt-4 p-2 rounded-md"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          className="w-full h-40 p-2 my-4 text-black rounded-md"
          placeholder="Comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        ></textarea>

        {/* TODO disabled if no text */}
        {comment.length > 0 && <ButtonGradient disabled={comment.length === 0}>Add Comment</ButtonGradient>}
      </form>
    </div>
  );
}
