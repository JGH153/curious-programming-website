export function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="bg-blue-500 text-white font-bold px-4 py-4 rounded hover:bg-blue-700 active:bg-blue-300"
      onClick={() => onClick()}
    >
      {label}
    </button>
  );
}
