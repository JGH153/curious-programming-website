import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import React, { useState } from "react";
import { sanityClient } from "../api/sanityClient";
import { Header } from "../components/header";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { MDXProvider } from "@mdx-js/react";
import Head from "next/head";
import { config } from "../shared/config";

interface Author {
  name: string;
  slug: string;
  bio: any;
  imageUrl: string;
}

interface Props {
  author: Author;
}

const About: NextPage<Props> = (props) => {
  /*
  Clean up schema for author
  Get my author doc
  display it
  Make it work with a component with MDX
  https://www.smashingmagazine.com/2020/12/mdx-stored-sanity-next-js-website/
  */

  /*
  left and right side 50%
  img on right
  title(name) and text on left
  */
  // const [val, toggle] = useState(1);

  const components: React.ComponentProps<typeof MDXProvider>["components"] = {
    strong: (props: any) => <span className="font-bold">{props.children}</span>,
  };

  return (
    <>
      <Head>
        <title>About - Curious Programming</title>
      </Head>
      <section className="flex items-center justify-center space-y-4 flex-col-reverse md:flex-row">
        <div className="w-1/2 pa-4 flex flex-col space-y-4 p-4">
          <h1 className="text-3xl font-bold text-center">
            <span className="font-normal">About:</span> {props.author.name}
          </h1>
          {/* <p>{props.author.bio}</p> */}
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
    '*[_type == "author" && _id == $gregerId] {name, slug, bio, "imageUrl": image.asset->url, _id, _createdAt, _updatedAt}';

  // hardcoded ID for now
  const author: Author[] = await sanityClient.fetch(query, { gregerId: "706a7fa2-21ca-4381-8087-dedd1bf099ca" });
  if (author.length !== 1) {
    // TODO
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
