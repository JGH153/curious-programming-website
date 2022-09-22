import Link from "next/link";
import { Category } from "../shared/Category.interface";

export function PostCategoriesList(props: { categories: Category[] }) {
  return (
    <div className="flex space-x-2">
      {props.categories &&
        props.categories.map((current) => (
          <Link
            href={"/category/" + current.slug.current}
            key={current.slug.current}
          >
            <a>
              <button className=" bg-blue-700 rounded px-3 py-2">{current.title}</button>
            </a>
          </Link>
        ))}
    </div>
  );
}
