import { PortableText } from "@portabletext/react";
import { PortableTextCode } from "./PortableTextCode";
import { PortableTextImage } from "./PortableTextImage";

const myPortableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl mt-10 font-bold">{children}</h1>,
    h2: ({ children }: any) => <h1 className="text-2xl mt-6">{children}</h1>,
    h3: ({ children }: any) => <h1 className="text-xl mt-4">{children}</h1>,
    h4: ({ children }: any) => <h1 className="text-lg mt-3">{children}</h1>,
    normal: ({ children }: any) => <p className="text-lg pt-3 pb-0">{children}</p>,
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
