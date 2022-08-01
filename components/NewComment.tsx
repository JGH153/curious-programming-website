import LogRocket from "logrocket";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { config } from "../shared/config";
import { httpClient } from "../shared/httpClient";
import { ButtonGradient } from "./ButtonGradient";
import { LoadingSpinner } from "./LoadingSpinner";
import { Notification } from "./Notification";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function NewComment(props: { postId: string; myUserName: string; setMyUserName: (newValue: string) => void }) {
  const router = useRouter();
  const showMessageOnReloadKey = "delayedMessage";
  const [loading, isLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState("");
  const [submitError, setSubmitError] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const storedMessage = sessionStorage.getItem(showMessageOnReloadKey);
    if (storedMessage && storedMessage.length > 0) {
      setShowSuccessNotification(storedMessage);
      sessionStorage.removeItem(showMessageOnReloadKey);
    }
  }, []);

  const removeNotification = () => {
    setShowSuccessNotification("");
    sessionStorage.removeItem(showMessageOnReloadKey);
  };

  const getRecaptchaToken = async () => {
    if (!executeRecaptcha) {
      setSubmitError("Execute recaptcha not yet available");
      return;
    }
    return await executeRecaptcha("comment");
  };

  const onSubmit = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();

    if (props.myUserName.length === 0 || comment.length === 0) {
      return;
    }

    isLoading(true);
    const recaptchaToken = await getRecaptchaToken();

    const response = await httpClient.post("/api/comment", {
      comment: comment,
      postId: props.postId,
      author: props.myUserName,
      recaptchaToken: recaptchaToken,
    });
    if (response.status === 400) {
      if (response.body.error === config.apiErrors.tooLowRecaptchaScore) {
        setSubmitError("Your captcha score is too low to submit comments");
      } else {
        setSubmitError("Error submitting comment");
      }
    }
    if (response.status === 200) {
      setSubmitError("");
      LogRocket.identify(config.logRocketProject, {
        name: props.myUserName,
      });
      // consider a TTL so it is gone on page navigation
      if (response.body.approved) {
        sessionStorage.setItem(showMessageOnReloadKey, "Comment added successfully ✔️");
      } else {
        sessionStorage.setItem(
          showMessageOnReloadKey,
          "Comment added successfully, but is held for review before it appears on the site"
        );
      }
      setComment(""); // bit redundant with reload
      router.reload();
    } else {
      setSubmitError(response.body);
    }
    isLoading(false);
  };

  return (
    <div className="">
      {showSuccessNotification.length > 0 && (
        <Notification onClick={() => removeNotification()}>{showSuccessNotification}</Notification>
      )}
      <form onSubmit={onSubmit}>
        <h1 className="mt-10 text-3xl font-bold">Add a new comment:</h1>
        {loading && <LoadingSpinner />}
        {/* <InputMarkdown /> */}
        <input
          type="text"
          className="text-black mt-4 p-2 rounded-md w-full md:w-1/2"
          placeholder="Author"
          value={props.myUserName}
          onChange={(e) => props.setMyUserName(e.target.value)}
        />
        <textarea
          className="w-full h-40 p-2 my-4 text-black rounded-md"
          placeholder="Comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        ></textarea>

        {submitError && <p className="text-red-500 mb-4">{submitError}</p>}

        {comment.length > 0 && props.myUserName.length > 0 && (
          <ButtonGradient disabled={comment.length === 0}>Add Comment</ButtonGradient>
        )}
      </form>
    </div>
  );
}
