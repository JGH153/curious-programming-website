import { ReactNode } from "react";

export function Notification(props: { children: ReactNode; onClick: () => void }) {
  return (
    <div
      className="fixed top-0 right-0 mr-4 mt-4 cursor-pointer"
      onClick={() => props.onClick()}
    >
      <div
        className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
        role="alert"
      >
        <div className="pl-4 text-sm font-normal">{props.children}</div>
      </div>
    </div>
  );
}
