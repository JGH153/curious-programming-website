import { format } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { BlogPostCard } from "../components/BlogPostCard";
import { HomeInfoSection } from "../components/HomeInfoSection";
import { Category } from "../shared/Category.interface";
import { config } from "../shared/config";
import { defaultDateFormat } from "../shared/dateHelpers";
import { sanityClient } from "../shared/sanityClient";
import { SanitySlug } from "../shared/SanitySlug.interface";

interface BlogPost {
  title: string;
  ingress: string;
  postedDate: string;
  categories: Category[];
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
}

const Home: NextPage<Props> = (props) => {
  return (
    <>
      <Head>
        <title>{config.metaTags.title}</title>
        <meta
          name="description"
          content={config.metaTags.mainDescription}
        />
      </Head>
      <HomeInfoSection />
      <section>
        {/* List off posts */}
        <div className="flex flex-col space-y-4">
          {props.posts.map((current: BlogPost) => (
            <BlogPostCard
              title={current.title}
              slug={current.slug}
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
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // ^ means current document
  const query = `
    *[_type == "post"] 
    | order(_createdAt desc) 
    {title, ingress, slug, fireReactions, surprisedReactions, mehReactions, _id, _createdAt, _updatedAt, 
      categories[]->{title, slug}, 
      "sumComments": count(*[_type == "comment" && postId._ref == ^._id])
    }`;

  const posts: BlogPost[] = ((await sanityClient.fetch(query)) as BlogPost[]).map((current) => ({
    ...current,
    postedDate: format(new Date(current._createdAt), defaultDateFormat),
    sumReactions: current.fireReactions + current.surprisedReactions + current.mehReactions,
  }));

  return {
    props: { posts: posts },
    revalidate: config.defaultRevalidateTime,
  };
};

export default Home;
