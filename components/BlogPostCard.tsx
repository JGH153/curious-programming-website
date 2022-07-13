import Link from "next/link";
import { ReactNode } from "react";
import { Category } from "../shared/Category.interface";

export function BlogPostCard({
  title,
  id,
  categories,
  postedDate,
  ingress,
  children,
}: {
  title: string;
  id: string;
  categories: Category[];
  postedDate: string;
  ingress: string;
  children?: ReactNode;
}) {
  // https://flowbite.com/docs/components/card/
  return (
    <>
      <div>
        <Link
          key={title}
          href={"/post/" + id}
        >
          <a>
            <div className="p-6 rounded-lg rounded-b-none border border-b-0 shadow-md bg-gray-800 border-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{title}</h5>
              <div className="mb-3 font-normal text-gray-400">
                <div className=""> Published: {postedDate}</div>
                {ingress}
                {children}
              </div>
            </div>
          </a>
        </Link>
        <div className="py-2 px-6 mt-0 rounded-lg rounded-t-none border shadow-md bg-gray-900 border-gray-700 flex justify-between items-center">
          <div>Likes and comments</div>
          <div className="flex space-x-2">
            {/* TODO create page */}
            {categories.map((current) => (
              <Link
                href={"/category/" + current.slug.current}
                key={current.slug.current}
              >
                <a>
                  <div className=" bg-blue-700 rounded px-3 py-2">{current.title}</div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
