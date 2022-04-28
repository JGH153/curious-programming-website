import { NextPage } from "next";
import { sanityClient } from "../../api/sanityClient";
import { PortableText } from "@portabletext/react";

// todo move to shared
interface BlogPost {
  title: string;
  ingress: string;
  body: any[];
  _id: string;
}

const Post: NextPage<{ post: BlogPost }> = (props) => {
  console.log(props.post.body);
  // Render post...
  return (
    <>
      <div>
        <h1>{props.post.title}</h1>
        <h2>{props.post.ingress}</h2>
        {/* {props.post.body} */}
        <PortableText value={props.post.body} />
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

  const query = '*[_type == "post" && _id == $postId] {title, ingress, body, _id, _createdAt, _updatedAt}';

  const posts: BlogPost[] = await sanityClient.fetch(query, { postId: params.id });
  if (posts.length !== 1) {
    // TODO
    throw new Error("Post not found");
  }

  // Pass post data to the page via props
  return { props: { post: posts[0] } };
}

export default Post;
