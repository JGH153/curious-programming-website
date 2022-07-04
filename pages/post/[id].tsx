// TODO fix
/* eslint-disable @next/next/no-img-element */
import { PortableText } from "@portabletext/react";
import format from "date-fns/format";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { CommentList } from "../../components/CommentList";
import { NewComment } from "../../components/NewComment";
import { PostAuthor } from "../../components/PostAuthor";
import { PostReactions } from "../../components/PostReactions";
import { Comment } from "../../shared/comment.interface";
import { config } from "../../shared/config";
import { defaultDateFormat } from "../../shared/dateHelpers";
import { Reaction } from "../../shared/Reaction.interface";
import { sanityClient } from "../../shared/sanityClient";

// todo move to shared?
interface BlogPost {
  title: string;
  ingress: string;
  imageUrl: string;
  _createdAt: string;
  postedDate: string;
  body: any[];
  _id: string;

  fireReactions: number;
  surprisedReactions: number;
  mehReactions: number;
}

const myPortableTextComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl mt-10 font-bold">{children}</h1>,
    h2: ({ children }: any) => <h1 className="text-2xl mt-6">{children}</h1>,
    h3: ({ children }: any) => <h1 className="text-xl mt-4">{children}</h1>,
    h4: ({ children }: any) => <h1 className="text-lg mt-3">{children}</h1>,
    normal: ({ children }: any) => <p className="pt-3 pb-0">{children}</p>,
  },
};

const Post: NextPage<{ post: BlogPost; comments: Comment[] }> = (props) => {
  const reactions: Reaction[] = [
    { emoji: "🔥", count: props.post.fireReactions },
    { emoji: "😲", count: props.post.surprisedReactions },
    { emoji: "😒", count: props.post.mehReactions },
  ];

  return (
    <>
      <Head>
        <title>{props.post.title} - Curious Programming</title>
      </Head>
      <div>
        <h1 className="text-6xl text-left mb-8">{props.post.title}</h1>
        <p className="pb-6">{props.post.ingress}</p>
        {/* TODO improve image (does not handle scale down well) */}
        {/* <div className="container relative imageContainer rounded-lg mb-4 overflow-hidden max-w-7xl">
          <Image
            src={props.post.imageUrl}
            alt={props.post.title}
            layout="fill"
          />
        </div> */}
        <img
          className="rounded-lg mb-4 "
          src={props.post.imageUrl}
          alt={props.post.title}
        ></img>

        <div className=""> Published: {props.post.postedDate}</div>
        {/* TODO correct data + email */}
        <PostAuthor
          name="Jan Greger Hemb"
          title="Lead Front End Solution Architect"
          imageUrl="https://cdn.sanity.io/images/p3gew69c/production/c2f0618d184e9ebcda96ddddb19ec1bed5e64835-2510x2511.jpg"
        />

        <PortableText
          value={props.post.body}
          components={myPortableTextComponents}
        />

        <PostReactions
          postId={props.post._id}
          reactions={reactions}
        />

        {/* newly added components not showing, TODO fore reload and refresh (on demand ISR?)? */}
        <CommentList
          postId={props.post._id}
          comments={props.comments}
        />
        <NewComment postId={props.post._id} />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // move to API folder?
  const query = '*[_type == "post"] {title, ingress, _id, _createdAt, _updatedAt}';

  const posts: BlogPost[] = await sanityClient.fetch(query);

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post._id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async (context) => {
  const loadPost = async (postId: string) => {
    const query =
      '*[_type == "post" && _id == $postId] | order(_createdAt asc) {title, ingress, body, "imageUrl": mainImage.asset->url, _id, _createdAt, _updatedAt, fireReactions, surprisedReactions, mehReactions}';

    const posts: BlogPost[] = (
      (await sanityClient.fetch(query, { postId: context.params?.id ?? -1 })) as BlogPost[]
    ).map((current) => ({
      ...current,
      postedDate: format(new Date(current._createdAt), defaultDateFormat),
    }));
    if (posts.length !== 1) {
      // TODO
      throw new Error("Post not found");
    }
    return posts;
  };
  const loadComments = async (postId: string) => {
    // TODO  && approved == true
    const query =
      '*[_type == "comment" && postId == $postId] | order(_createdAt asc) {postId, author, approved, body, _id, _createdAt, _updatedAt} ';

    const comments: Comment[] = ((await sanityClient.fetch(query, { postId })) as Comment[]).map((current) => ({
      ...current,
      postedDate: format(new Date(current._createdAt), defaultDateFormat),
    }));

    return comments;
  };
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  // const res = await fetch(`https://.../posts/${params.id}`);
  // const post = await res.json();

  if (Array.isArray(context.params?.id)) {
    throw new Error("Post not found");
  }

  const posts = await loadPost(context.params?.id ?? "-1");
  const comments = await loadComments(context.params?.id ?? "-1");

  // LOAD comments

  // Pass post data to the page via props
  return { props: { post: posts[0], comments }, revalidate: config.defaultRevalidateTime };
};

export default Post;
