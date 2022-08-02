import Image from "next/image";

export function PostAuthor(props: { name: string; title: string; email: string; imageUrl: string }) {
  return (
    <div className="flex">
      <Image
        className="rounded-full"
        width={80}
        height={80}
        src={props.imageUrl}
        alt={props.name}
      ></Image>
      <div className="flex flex-col justify-center ml-3">
        <div className="text-lg">
          <a
            href={"mailto:" + props.email}
            target="_blank"
            rel="noreferrer"
          >
            {props.name}
          </a>
        </div>
        <div className="h-0.5 bg-white"></div>
        <div className="text-lg">{props.title}</div>
      </div>
    </div>
  );
}
