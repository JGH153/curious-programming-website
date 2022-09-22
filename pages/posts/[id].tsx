import { format } from "date-fns";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { BlogPostCard } from "../../components/BlogPostCard";
import { LoadingNewPage } from "../../components/LoadingNewPage";
import { Category } from "../../shared/Category.interface";
import { config } from "../../shared/config";
import { defaultDateFormat } from "../../shared/dateHelpers";
import { sanityClient } from "../../shared/sanityClient";
import { SanitySlug } from "../../shared/SanitySlug.interface";

interface BlogPost {
  title: string;
  ingress: string;
  postedDate: string;
  categories: Category[];
  imageUrl: string;
  fireReactions: number;
  surprisedReactions: number;
  mehReactions: number;
  sumReactions: number;
  sumComments: number;
  slug: SanitySlug;
  _id: string;
  _createdAt: string;
}

interface Props {
  posts: BlogPost[];
  pageNumber: string;
  finalPage: boolean;
}

const PostsPage: NextPage<Props> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <LoadingNewPage />;
  }

  return (
    <>
      <Head>
        <title>{`List of posts page ${props.pageNumber} - ${config.metaTags.title}`}</title>
        <meta
          name="description"
          content={config.metaTags.mainDescription}
        />
      </Head>
      <h1 className="text-center my-8 text-4xl">All posts page {props.pageNumber}</h1>
      <section>
        <div className="flex flex-col space-y-4">
          {props.posts.map((current: BlogPost) => (
            <BlogPostCard
              title={current.title}
              slug={current.slug}
              imageUrl={current.imageUrl}
              categories={current.categories}
              key={current._id}
              postedDate={current.postedDate}
              ingress={current.ingress}
              sumReactions={current.sumReactions}
              sumComments={current.sumComments}
            />
          ))}
        </div>
      </section>
      <div className="flex justify-center space-x-2">
        {+props.pageNumber > 1 && (
          <Link href={`/posts/${+props.pageNumber - 1}`}>
            <a>
              <button className=" bg-blue-700 rounded py-2 mt-5 px-10 text-center">Prev page</button>
            </a>
          </Link>
        )}
        {!props.finalPage && (
          <Link href={`/posts/${+props.pageNumber + 1}`}>
            <a>
              <button className=" bg-blue-700 rounded py-2 mt-5 px-10 text-center">Next Page</button>
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

async function getTotalPosts() {
  const query = `count(*[_type == "post"])`;

  const numPosts: number = await sanityClient.fetch(query);
  return numPosts;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const numPosts: number = await getTotalPosts();
  const pages = Array(Math.ceil(numPosts / config.postsPerPage))
    .fill(0)
    .map((current, index) => ({ params: { id: (index + 1).toString() } }));

  return { paths: pages, fallback: true };
};

// duplicate with index almost
export const getStaticProps: GetStaticProps = async (context) => {
  // ^ means current document
  // using easy but slow pagination due to low post volume
  const pageNumber = context.params?.id as string;
  const from = (+pageNumber - 1) * config.postsPerPage;
  const to = from + config.postsPerPage;
  const query = `
    *[_type == "post"] 
    | order(_createdAt desc) [${from}...${to}]
    {title, ingress, slug, "imageUrl": mainImage.asset->url, fireReactions, surprisedReactions, mehReactions, _id, _createdAt, _updatedAt, 
      categories[]->{title, slug}, 
      "sumComments": count(*[_type == "comment" && postId._ref == ^._id])
    }`;

  const posts: BlogPost[] = ((await sanityClient.fetch(query)) as BlogPost[]).map((current) => ({
    ...current,
    postedDate: format(new Date(current._createdAt), defaultDateFormat),
    sumReactions: current.fireReactions + current.surprisedReactions + current.mehReactions,
  }));

  const totalPosts: number = await getTotalPosts();

  return {
    props: { posts: posts, pageNumber: context.params?.id ?? "1", finalPage: to >= totalPosts },
    revalidate: config.defaultRevalidateTime,
  };
};

export default PostsPage;
