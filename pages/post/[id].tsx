import { PortableText } from "@portabletext/react";
import format from "date-fns/format";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import probe from "probe-image-size";
import { useEffect, useRef, useState } from "react";
import { CommentList } from "../../components/CommentList";
import { LoadingNewPage } from "../../components/LoadingNewPage";
import { NewComment } from "../../components/NewComment";
import { PostAuthor } from "../../components/PostAuthor";
import { PostReactions } from "../../components/PostReactions";
import { Author } from "../../shared/author.interface";
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
  author: Author;
  authorImgUrl: string;
  _createdAt: string;
  postedDate: string;
  body: any[];
  _id: string;
  imageWidth: number;
  imageHeight: number;

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

const Post: NextPage<{ post: BlogPost; comments: Comment[]; notFound: boolean }> = (props) => {
  const [myUserName, setMyUserName] = useState("");
  const isFirstRun = useRef(true);

  const router = useRouter();

  const loadLastUserName = () => {
    const storedValue = localStorage.getItem(config.localStorageKeys.myUserName) || "";
    setMyUserName(storedValue);
  };

  useEffect(() => {
    if (isFirstRun.current) {
      loadLastUserName();
      isFirstRun.current = false;
      return;
    }
    localStorage.setItem(config.localStorageKeys.myUserName, myUserName);
  }, [myUserName]);

  const reactions: Reaction[] = [
    { emoji: "🔥", count: props.post?.fireReactions ?? 0 },
    { emoji: "😲", count: props.post?.surprisedReactions ?? 0 },
    { emoji: "😒", count: props.post?.mehReactions ?? 0 },
  ];

  if (props.notFound) {
    return <h1 className="text-4xl text-center">Post not found</h1>;
  }

  if (router.isFallback) {
    return <LoadingNewPage />;
  }

  return (
    <>
      <Head>
        {/* Meta and open graph meta tags (FB for example) */}
        <title>{`${props.post.title} - ${config.metaTags.title}`}</title>
        <meta
          name="description"
          content={`${props.post.ingress} written by ${props.post.author.name}`}
        />
        <meta
          property="og:title"
          content={`${props.post.title} - ${config.metaTags.title}`}
        />
        <meta
          property="og:type"
          content="article"
        />
        <meta
          property="og:description"
          content={`${props.post.ingress} written by ${props.post.author.name}`}
        />
      </Head>
      <div>
        <h1 className="text-6xl text-left mb-8">{props.post.title}</h1>
        <p className="pb-6 text-lg">{props.post.ingress}</p>
        <Image
          className="rounded-lg mb-4"
          src={props.post.imageUrl}
          alt={props.post.title}
          width={props.post.imageWidth}
          height={props.post.imageHeight}
        />
        <div className=""> Published: {props.post.postedDate}</div>
        <PostAuthor
          name={props.post.author.name}
          title={props.post.author.title}
          email={props.post.author.email}
          imageUrl={props.post.authorImgUrl}
        />
        <PortableText
          value={props.post.body}
          components={myPortableTextComponents}
        />

        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/uk1pWPNWofk"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        <PostReactions
          postId={props.post._id}
          reactions={reactions}
        />
        <CommentList
          myUserName={myUserName}
          postId={props.post._id}
          comments={props.comments}
        />
        <NewComment
          postId={props.post._id}
          myUserName={myUserName}
          setMyUserName={setMyUserName}
        />
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

  // fallback -> router.isFallback if 404
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const loadPost = async (postId: string) => {
    // TODO how to request author image url inside author?
    const query =
      '*[_type == "post" && _id == $postId] | order(_createdAt asc) {title, ingress, author->, "authorImgUrl": author->image.asset->url, body, "imageUrl": mainImage.asset->url, _id, _createdAt, _updatedAt, fireReactions, surprisedReactions, mehReactions}';

    const posts: BlogPost[] = ((await sanityClient.fetch(query, { postId })) as BlogPost[]).map((current) => ({
      ...current,
      postedDate: format(new Date(current._createdAt), defaultDateFormat),
    }));
    if (posts.length !== 1) {
      return null;
    }
    const post = posts[0];

    let result = await probe(post.imageUrl);
    post.imageWidth = result.width;
    post.imageHeight = result.height;

    return post;
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

  const post = await loadPost(context.params?.id ?? "-1");
  const comments = await loadComments(context.params?.id ?? "-1");
  const notFound = post === null;

  // LOAD comments

  // Pass post data to the page via props
  return { props: { post, comments, notFound }, revalidate: config.defaultRevalidateTime };
};

export default Post;
