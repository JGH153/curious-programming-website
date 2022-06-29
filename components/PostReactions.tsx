import { useState } from "react";
import { httpClient } from "../shared/httpClient";
import { Reaction } from "../shared/Reaction.interface";

export function PostReactions(props: { postId: string; reactions: Reaction[] }) {
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [lastVotedEmoji, setLastVotedEmoji] = useState("");

  const addReaction = async (emoji: string) => {
    // TODO api
    // save selection to local storage?
    // how to limit 1 time pr article?
    if (selectedEmoji === emoji) {
      setSelectedEmoji("");
      setLastVotedEmoji("");
      await httpClient.post("/api/reaction", { emoji, postId: props.postId, change: -1 });
      return;
    }
    setSelectedEmoji(emoji);
    setLastVotedEmoji(emoji);
    if (lastVotedEmoji.length == 2) {
      await httpClient.post("/api/reaction", { emoji: lastVotedEmoji, postId: props.postId, change: -1 });
    }
    await httpClient.post("/api/reaction", { emoji, postId: props.postId, change: 1 });
  };

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-2 font-bold">Your reaction?</h1>
      <div className="flex space-x-2">
        {props.reactions.map((reaction) => (
          <div
            key={reaction.emoji}
            className="flex items-center justify-center"
          >
            <button
              className={` text-4xl p-4 rounded-3xl hover:scale-105 active:scale-95 ${
                reaction.emoji === selectedEmoji ? "bg-active-orange" : "bg-secondary-dark "
              }`}
              onClick={() => addReaction(reaction.emoji)}
            >
              {reaction.emoji} {reaction.count + (reaction.emoji === selectedEmoji ? 1 : 0)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
