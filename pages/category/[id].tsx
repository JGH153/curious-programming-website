import { format } from "date-fns";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { BlogPostCard } from "../../components/BlogPostCard";
import { HomeInfoSection } from "../../components/HomeInfoSection";
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
  activeCategory: Category;
  notFound: boolean;
}

const CategoryPage: NextPage<Props> = (props) => {
  const router = useRouter();

  if (props.notFound) {
    return <h1 className="text-4xl text-center">Category not found</h1>;
  }

  if (router.isFallback) {
    return <LoadingNewPage />;
  }

  return (
    <>
      <Head>
        <title>{`${props.activeCategory.title} - ${config.metaTags.title}`}</title>
        <meta
          name="description"
          content={config.metaTags.mainDescription}
        />
      </Head>
      <h1 className="text-center my-8 text-4xl">
        All posts with category: <span className="font-bold">{props.activeCategory.title}</span>
      </h1>
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
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = '*[_type == "category"] {slug}';

  const posts: Category[] = await sanityClient.fetch(query);

  const paths = posts.map((post) => ({
    params: { id: post.slug.current },
  }));

  return { paths, fallback: true };
};

//[count((categories[]->slug.current)[@ in ["design-system"]]) > 0
// categories[]->slug.current == "design-system"
export const getStaticProps: GetStaticProps = async (context) => {
  const query =
    '*[_type == "post" && count((categories[]->slug.current)[@ in [$currentCategories]]) > 0 ] | order(_createdAt desc) {title, ingress, slug, "imageUrl": mainImage.asset->url, fireReactions, surprisedReactions, mehReactions, _id, _createdAt, _updatedAt, categories[]->{title, slug}, "sumComments": count(*[_type == "comment" && postId._ref == ^._id])}';

  const posts: BlogPost[] = (
    (await sanityClient.fetch(query, { currentCategories: context.params?.id })) as BlogPost[]
  ).map((current) => ({
    ...current,
    postedDate: format(new Date(current._createdAt), defaultDateFormat),
    sumReactions: current.fireReactions + current.surprisedReactions + current.mehReactions,
  }));

  const getActiveCategory = (posts: BlogPost[]) => {
    if (posts.length === 0) {
      return null;
    }
    return posts[0]?.categories.find((current) => current.slug.current === context.params?.id);
  };

  const activeCategory = getActiveCategory(posts);
  const notFound = activeCategory === null;

  return {
    props: { posts, activeCategory, notFound },
    revalidate: config.defaultRevalidateTime,
  };
};

export default CategoryPage;
