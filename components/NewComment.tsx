import { useRouter } from "next/router";
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
  const router = useRouter();
  const localStorageKey = "author";
  const [loading, isLoading] = useState(false);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");

  const onSubmit = async (form: React.FormEvent<HTMLFormElement>) => {
    // TODO spinner
    form.preventDefault();
    router.reload();

    if (author.length === 0 || comment.length === 0) {
      return;
    }

    isLoading(true);
    const response = await httpClient.post("/api/comment", { comment: comment, postId: props.postId, author });
    if (response.status === 200) {
      // TODO notification
      localStorage.setItem(localStorageKey, author);
      setComment("");
      router.reload();
    } else {
      console.error(response.body);
    }
    isLoading(false);
  };

  useEffect(() => {
    const storedValue = localStorage.getItem(localStorageKey) || "";
    setAuthor(storedValue);
  }, []);

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <h1 className="mt-10 text-3xl font-bold">Add a new comment:</h1>
        {/* TODO improve */}
        {loading && <LoadingSpinner />}
        {/* <InputMarkdown /> */}
        <input
          type="text"
          className="text-black mt-4 p-2 rounded-md w-full md:w-1/2"
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
        {comment.length > 0 && author.length > 0 && (
          <ButtonGradient disabled={comment.length === 0}>Add Comment</ButtonGradient>
        )}
      </form>
    </div>
  );
}
