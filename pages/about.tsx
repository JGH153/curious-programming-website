import { MDXProvider } from "@mdx-js/react";
import { GetStaticProps, NextPage } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { Author } from "../shared/author.interface";
import { config } from "../shared/config";
import { sanityClient } from "../shared/sanityClient";

interface Props {
  author: Author;
}

const About: NextPage<Props> = (props) => {
  // Add any components used in the MDX here
  const components: React.ComponentProps<typeof MDXProvider>["components"] = {
    strong: (props: any) => <span className="font-bold">{props.children}</span>,
  };

  return (
    <>
      <Head>
        <title>
          About: {props.author.name} - {config.metaTags.title}
        </title>
        <meta
          name="description"
          content={`About: ${props.author.name} - ${props.author.title}`}
        />
      </Head>
      <section className="flex items-center justify-center space-y-4 flex-col-reverse md:flex-row">
        <div className="w-1/2 pa-4 flex flex-col space-y-4 p-4">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold text-center">
              <a
                href={"mailto:" + props.author.email}
                target="_blank"
                rel="noreferrer"
              >
                {props.author.name}
              </a>
            </h1>
            <h2 className="text-xl font-bold text-center">{props.author.title}</h2>
          </div>
          <MDXRemote
            {...props.author.bio}
            components={components}
          />
        </div>
        <div className="w-1/2 px-2 lg:px-0">
          <div className="container relative imageContainer-short mb-4">
            <Image
              src={props.author.imageUrl}
              alt={props.author.name}
              layout="fill"
              objectFit={"contain"}
            />
          </div>
        </div>
      </section>
    </>
  );
};

// <a href="https://www.flaticon.com/free-icons/youtube" title="youtube icons">Youtube icons created by Freepik - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/medium" title="medium icons">Medium icons created by Freepik - Flaticon</a>
// <a href="https://www.flaticon.com/free-icons/twitter" title="twitter icons">Twitter icons created by Freepik - Flaticon</a>

export const getStaticProps: GetStaticProps = async () => {
  const query =
    '*[_type == "author" && _id == $gregerId] {name, slug, title, email, bio, "imageUrl": image.asset->url, _id, _createdAt, _updatedAt}';

  // hardcoded ID as only one
  const author: Author[] = await sanityClient.fetch(query, { gregerId: "706a7fa2-21ca-4381-8087-dedd1bf099ca" });
  if (author.length !== 1) {
    throw new Error("Author not found");
  }

  const authorSerialized = await Promise.all(
    author.map(async (current) => {
      return {
        ...current,
        bio: await serialize(current.bio),
      };
    })
  );

  // Pass post data to the page via props
  return { props: { author: authorSerialized[0] }, revalidate: config.defaultRevalidateTime };
};

export default About;
