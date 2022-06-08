import { ReactNode } from "react";
import { Button } from "./Button";
import { ButtonGradient } from "./ButtonGradient";

export function Card({
  title,
  actionContent,
  children,
}: {
  title: string;
  actionContent?: ReactNode;
  children: ReactNode;
}) {
  // https://flowbite.com/docs/components/card/
  return (
    <>
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        </a>
        <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">{children}</div>
        {actionContent}
        {/* <ButtonGradient
          label="Read more"
          onClick={() => {}}
        /> */}
      </div>
    </>
  );
}
