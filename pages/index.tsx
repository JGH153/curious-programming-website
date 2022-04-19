import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Header } from "../components/header";
import styles from "../styles/Home.module.css";

interface ItemLink {
  href: string;
  label: string;
  imgUrl: string;
}

const Home: NextPage = () => {
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
    <div className="flex justify-center align-top">
      <div className="max-w-4xl">
        <Header />
        <main>
          123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse tenetur eaque omnis eum rem. Ex voluptas,
          iste aperiam eligendi magni harum minus iusto consectetur earum fugiat praesentium quos tenetur veniam.
          <section className="container flex flex-col md:flex-row items-center mb-16 mt-10 px-6 space-y-0 ">
            <div className="flex flex-col space-y-12 md:w-1/2">
              <h1 className="max-w-md text-3xl font-bold text-center md:text-5xl md:text-left">
                A blog for Curious Programming
              </h1>
              <p className="max-w-sm text-center text-white md:text-left">
                A collection of blog post, videos and more for mainly frontend developers, but also so much more.
                Everything from low level processor architecture to developer rights and more.
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
              <h1 className="text-2xl font-bold text-left md:text-4xl">Links</h1>
              {links.map((element) => (
                <a
                  href={element.href}
                  className="flex items-center justify-center space-x-2"
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
          </section>
        </main>
        {/* 
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
      </div>
    </div>
  );
};

export default Home;
