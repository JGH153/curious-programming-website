import Link from "next/link";
import { useState } from "react";
import { HamburgerButton } from "./HamburgerButton";

interface PageItem {
  href: string;
  label: string;
}

export function Header() {
  const pages: PageItem[] = [
    {
      href: "/",
      label: "Blog",
    },
    {
      href: "/video",
      label: "Videos",
    },
    {
      href: "/about",
      label: "About",
    },
  ];
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
            <Link href={"/"}>
              <a className="text-primary underlined focus:outline-none block whitespace-nowrap text-3xl md:text-4xl lg:text-5xl font-medium transition">
                Curious Programming 🤔
              </a>
            </Link>
            {/* </a> */}
          </div>
          <ul className="hidden md:flex">
            {pages.map((page, i) => (
              <li
                className="px-5 py-2"
                key={page.label}
              >
                <Link href={page.href}>
                  <a className="text-xl font-medium underlined">{page.label}</a>
                </Link>
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
          <div className="pl-5">
            <HamburgerButton
              open={open}
              onClick={() => setOpen(!open)}
            />
          </div>
        </nav>
      </div>

      {open && (
        <ul className="absolute flex flex-col items-center justify-center py-8 mt-2 space-y-6 drop-shadow-lg left-6 right-6 font-bold bg-background-dark">
          {/* <ul className="absolute flex-col items-center self-end py-8 mt-10 space-y-6 font-bold bg-white sm:w-auto sm:self-center left-6 right-6 drop-shadow-md"> */}
          {pages.map((page, i) => (
            <li
              className="px-5 py-2"
              key={page.label}
            >
              <span className="text-lg font-medium underlined">{page.label}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
