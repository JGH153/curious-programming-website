export function PostReactions(props: { postId: string }) {
  const possibleReactions = ["🔥", "😍", "😲", "😥", "😤"];

  // TODO API for saving and getting
  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-2 font-bold">Your reaction?</h1>
      <div className="flex space-x-2">
        {possibleReactions.map((reaction) => (
          <div
            key={reaction}
            className="flex items-center justify-center"
          >
            <button className="text-4xl bg-secondary-dark p-4 rounded-3xl">{reaction} 0</button>
          </div>
        ))}
      </div>
    </div>
  );
}
