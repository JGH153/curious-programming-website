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
            <Link href={"/"}>
              <a className="text-primary underlined focus:outline-none block whitespace-nowrap text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium transition">
                Curious Programming <span className="hidden sm:inline-block">🤔</span>
              </a>
            </Link>
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
        <ul className="absolute flex flex-col items-center justify-center py-8 mt-2 space-y-6 drop-shadow-lg left-6 right-6 font-bold z-10 bg-background-dark md:hidden">
          {pages.map((page, i) => (
            <li
              className="px-5 py-2"
              key={page.label}
            >
              <span className="text-lg font-medium underlined">
                <Link href={page.href}>
                  <a
                    className="text-xl font-medium underlined"
                    onClick={() => setOpen(false)}
                  >
                    {page.label}
                  </a>
                </Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
