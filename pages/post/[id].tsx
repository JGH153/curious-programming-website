import { NextPage } from "next";
import { sanityClient } from "../../api/sanityClient";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Head from "next/head";

// todo move to shared
interface BlogPost {
  title: string;
  ingress: string;
  imageUrl: string;
  body: any[];
  _id: string;
}

const myPortableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-5xl mb-5">{children}</h1>,
    h2: ({ children }: any) => <h1 className="text-3xl mb-4">{children}</h1>,
    h3: ({ children }: any) => <h1 className="text-xl mb-3">{children}</h1>,
    h4: ({ children }: any) => <h1 className="text-lg mb-2">{children}</h1>,
  },
};

const Post: NextPage<{ post: BlogPost }> = (props) => {
  console.log(props.post.imageUrl, "imageUrl");
  // Render post...
  return (
    <>
      <Head>
        <title>{props.post.title} - Curious Programming</title>
      </Head>
      <div>
        <h1 className="text-6xl text-center mb-8">{props.post.title}</h1>
        <p className="pb-6">{props.post.ingress}</p>
        {/* TODO improve image */}
        <div className="container relative imageContainer">
          <Image
            src={props.post.imageUrl}
            alt={props.post.title}
            layout="fill"
            objectFit={"contain"}
          />
        </div>
        <PortableText
          value={props.post.body}
          components={myPortableTextComponents}
        />
      </div>
    </>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  const query = '*[_type == "post"] {title, ingress, _id, _createdAt, _updatedAt}';
  // const params = { minSeats: 2 };

  const posts: BlogPost[] = await sanityClient.fetch(query);

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post._id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }: any) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  // const res = await fetch(`https://.../posts/${params.id}`);
  // const post = await res.json();

  const query =
    '*[_type == "post" && _id == $postId] {title, ingress, body, "imageUrl": mainImage.asset->url, _id, _createdAt, _updatedAt}';

  const posts: BlogPost[] = await sanityClient.fetch(query, { postId: params.id });
  if (posts.length !== 1) {
    // TODO
    throw new Error("Post not found");
  }

  // Pass post data to the page via props
  return { props: { post: posts[0] } };
}

export default Post;
