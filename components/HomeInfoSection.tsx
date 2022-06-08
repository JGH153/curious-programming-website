import Image from "next/image";

interface ItemLink {
  href: string;
  label: string;
  imgUrl: string;
}

export function HomeInfoSection() {
  const links: ItemLink[] = [
    {
      href: "https://www.youtube.com/channel/UCVHumdPKnAbTFceoP-rD33g",
      label: "Youtube Channel",
      imgUrl: "/youtube.png",
    },
    {
      href: "https://medium.com/@jan.greger",
      label: "Medium",
      imgUrl: "/medium.png",
    },
    {
      href: "https://twitter.com/JGH153",
      label: "Twitter",
      imgUrl: "/twitter.png",
    },
  ];

  return (
    <section className="flex items-center justify-center">
      <div className="container flex flex-col items-center md:flex-row mb-10 px-6 space-y-4 mx-auto">
        <div className="flex flex-col space-y-4 md:w-1/2">
          <h1 className="max-w-md text-3xl font-bold text-center md:text-4xl md:text-left">A place for Curiosity</h1>
          <p className="max-w-sm text-center text-white md:text-left">
            A collection of blog post, videos and more for mainly frontend developers, but also so much more. Everything
            from low level processor architecture to developer rights and more.
          </p>
          {/* <div className="flex justify-center md:justify-start">
				<a
					href="#"
					className="p-3 px-6 text-white bg-orange-600 rounded-full items-baseline hover:bg-orange-700"
				>
					Kjøp noe
				</a>
			</div> */}
        </div>
        <div className="flex flex-col space-y-2 items-start mx-auto max-w-max md:w-1/2">
          <h1 className="text-2xl font-bold text-left md:text-3xl">Useful Links</h1>
          {links.map((element) => (
            <a
              href={element.href}
              className="flex items-center justify-center space-x-2 underlined"
              key={element.href}
            >
              <Image
                src={element.imgUrl}
                width={40}
                height={40}
                alt={element.label}
              />
              <span>{element.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
