import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Category } from "../shared/Category.interface";
import { SanitySlug } from "../shared/SanitySlug.interface";
import { PostCategoriesList } from "./PostCategoriesList";

export function BlogPostCard({
  title,
  slug,
  categories,
  postedDate,
  imageUrl,
  ingress,
  sumReactions,
  sumComments,
  children,
}: {
  title: string;
  slug: SanitySlug;
  categories: Category[];
  postedDate: string;
  imageUrl: string;
  ingress: string;
  sumReactions: number;
  sumComments: number;
  children?: ReactNode;
}) {
  // https://flowbite.com/docs/components/card/
  return (
    <>
      <div>
        <Link
          key={title}
          href={"/post/" + slug.current}
        >
          <a>
            <div className="relative h-40">
              <Image
                src={imageUrl}
                className="rounded-t-lg"
                layout="fill"
                objectFit={"cover"}
                alt="Main image for post"
              />
            </div>
            <div className="p-6 border border-b-0 border-t-0 shadow-md bg-gray-800 border-gray-700">
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
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
            <div>{sumReactions} reactions</div>
            <div>{sumComments} comments</div>
          </div>
          <PostCategoriesList categories={categories} />
        </div>
      </div>
    </>
  );
}
