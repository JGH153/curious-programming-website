import { useState } from "react";
import { HamburgerButton } from "./HamburgerButton";

export function Header() {
  const pages = ["Blog", "Videos", "About"];
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="p-5 lg:p-10">
        <nav className="text-primary mx-auto flex max-w-8xl items-center justify-between">
          <div>
            {/* <a
          className="text-primary underlined focus:outline-none block whitespace-nowrap text-2xl font-medium transition"
          href="/"
        > */}
            <h1 className="text-primary underlined focus:outline-none block whitespace-nowrap text-2xl font-medium transition">
              Curious Programming
            </h1>
            {/* </a> */}
          </div>
          <ul className="hidden sm:flex">
            {pages.map((page, i) => (
              <li
                className="px-5 py-2"
                key={page}
              >
                <span className="text-lg font-medium underlined">{page}</span>
              </li>
            ))}
            {/* <li className="px-5 py-2">
          <a
            className="underlined focus:outline-none block whitespace-nowrap text-lg font-medium hover:text-team-current focus:text-team-current active text-team-current"
            href="/blog"
          >
            Blog
          </a>
          <span className="text-lg font-medium">Blog</span>
        </li>
        <li className="px-5 py-2">Videos</li>
        <li className="px-5 py-2">About</li> */}
          </ul>
          <button onClick={() => setOpen(!open)}>
            <HamburgerButton open={open} />
          </button>
        </nav>
      </div>

      {open && (
        <ul className="absolute flex flex-col items-center justify-center py-8 mt-10 space-y-6 drop-shadow-lg left-6 right-6 font-bold bg-white">
          {/* <ul className="absolute flex-col items-center self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"> */}
          {pages.map((page, i) => (
            <li
              className="px-5 py-2"
              key={page}
            >
              <span className="text-lg font-medium underlined">{page}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
