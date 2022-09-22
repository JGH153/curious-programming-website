import { PortableText } from "@portabletext/react";
import { PortableTextBlockquote } from "./PortableTextBlockquote";
import { PortableTextCode } from "./PortableTextCode";
import { PortableTextImage } from "./PortableTextImage";

const myPortableTextComponents = {
  block: {
    blockquote: ({ children }: any) => <PortableTextBlockquote value={children} />,
    h1: ({ children }: any) => <h1 className="text-3xl mt-10 font-bold">{children}</h1>,
    h2: ({ children }: any) => <h1 className="text-2xl mt-6">{children}</h1>,
    h3: ({ children }: any) => <h1 className="text-xl mt-4">{children}</h1>,
    h4: ({ children }: any) => <h1 className="text-lg mt-3">{children}</h1>,
    normal: ({ children }: any) => <p className="text-lg pt-3 pb-0">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5">{children}</ol>,
  },
  marks: {
    link: ({ value, children }: any) => (
      <a
        className="underline"
        href={value?.href}
      >
        {children}{" "}
      </a>
    ),
  },
  types: {
    code: PortableTextCode,
    image: PortableTextImage,
  },
};

export function PortableTextComponent(props: { content: any }) {
  return (
    <PortableText
      value={props.content}
      components={myPortableTextComponents}
    />
  );
}
