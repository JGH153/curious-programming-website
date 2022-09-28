import { toPlainText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import probe from "probe-image-size";
import { useEffect, useMemo, useRef, useState } from "react";
import { CommentList } from "../../components/CommentList";
import { DisplayDate } from "../../components/DisplayDate";
import { LoadingNewPage } from "../../components/LoadingNewPage";
import { NewComment } from "../../components/NewComment";
import { PortableTextComponent } from "../../components/portable-text/PortableTextComponent";
import { PostAuthor } from "../../components/PostAuthor";
import { PostCategoriesList } from "../../components/PostCategoriesList";
import { PostReactions } from "../../components/PostReactions";
import { YoutubeVideo } from "../../components/YoutubeVideo";
import { Author } from "../../shared/author.interface";
import { Category } from "../../shared/Category.interface";
import { Comment } from "../../shared/comment.interface";
import { config } from "../../shared/config";
import { Reaction } from "../../shared/Reaction.interface";
import { sanityClient } from "../../shared/sanityClient";
import { SanitySlug } from "../../shared/SanitySlug.interface";

interface BlogPost {
  title: string;
  ingress: string;
  imageUrl: string;
  author: Author;
  authorImgUrl: string;
  categories: Category[];
  _createdAt: string;
  postedDate: string;
  body: PortableTextBlock[];
  _id: string;
  imageWidth: number;
  imageHeight: number;
  youtubeVideo: string;

  fireReactions: number;
  surprisedReactions: number;
  mehReactions: number;
}

interface BlogPostSlug {
  slug: SanitySlug;
}

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

  const getMinToRead = () => {
    if (!props.post?.body) {
      return 0;
    }
    const wordsInText = toPlainText(props.post?.body).split(" ").length;
    return Math.ceil(wordsInText / config.readSpeedWPM);
  };
  const minToRead = useMemo(getMinToRead, [props.post]);

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
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-left mb-8">{props.post.title}</h1>
        <p className="pb-6 text-lg">{props.post.ingress}</p>
        <Image
          className="rounded-lg mb-4"
          src={props.post.imageUrl}
          alt={props.post.title}
          width={props.post.imageWidth}
          height={props.post.imageHeight}
        />
        <div className="">
          Published: <DisplayDate date={props.post.postedDate} /> - {minToRead} min read
        </div>
        <PostAuthor
          name={props.post.author.name}
          title={props.post.author.title}
          email={props.post.author.email}
          imageUrl={props.post.authorImgUrl}
        />
        <PortableTextComponent content={props.post.body} />

        {props.post.youtubeVideo && <YoutubeVideo id={props.post.youtubeVideo} />}

        <div className="flex flex-col justify-center items-center mt-10">
          <h1 className="text-2xl mb-2 font-bold">Tags</h1>
          <PostCategoriesList categories={props.post.categories} />
        </div>

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
  const query = '*[_type == "post"] | order(_createdAt desc) {slug}';
  const posts: BlogPostSlug[] = await sanityClient.fetch(query);

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.slug.current },
  }));

  // fallback -> router.isFallback if 404
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const loadPost = async (postSlug: string) => {
    // TODO how to format better using prettier?
    const query =
      '*[_type == "post" && slug.current == $postSlug] | order(_createdAt desc) {title, ingress, "postedDate": _createdAt, author->, "authorImgUrl": author->image.asset->url, body, "imageUrl": mainImage.asset->url, youtubeVideo, categories[]->{title, slug}, _id, _createdAt, _updatedAt, fireReactions, surprisedReactions, mehReactions}';

    const posts: BlogPost[] = (await sanityClient.fetch(query, { postSlug })) as BlogPost[];
    if (posts.length !== 1) {
      return null;
    }
    const post = posts[0];

    // get image size for next/image
    let result = await probe(post.imageUrl);
    post.imageWidth = result.width;
    post.imageHeight = result.height;

    return post;
  };
  const loadComments = async (postId: string) => {
    const query =
      '*[_type == "comment" && postId._ref == $postId && approved == true] | order(_createdAt asc) {postId, author, "postedDate": _createdAt, approved, body, _id, _createdAt, _updatedAt} ';

    const comments: Comment[] = (await sanityClient.fetch(query, { postId })) as Comment[];

    return comments;
  };

  if (Array.isArray(context.params?.id)) {
    throw new Error("Post not found");
  }

  const post = await loadPost(context.params?.id ?? "-1");
  const comments = await loadComments(post?._id ?? "-1");
  const notFound = post === null;

  return { props: { post, comments, notFound }, revalidate: config.defaultRevalidateTime };
};

export default Post;
