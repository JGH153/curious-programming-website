import { format } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { BlogPostCard } from "../components/BlogPostCard";
import { HomeInfoSection } from "../components/HomeInfoSection";
import { Category } from "../shared/Category.interface";
import { config } from "../shared/config";
import { defaultDateFormat } from "../shared/dateHelpers";
import { sanityClient } from "../shared/sanityClient";

interface BlogPost {
  title: string;
  ingress: string;
  postedDate: string;
  categories: Category[];
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
              id={current._id}
              categories={current.categories}
              key={current._id}
            >
              <div className=""> Published: {current.postedDate}</div>
              {current.ingress}
            </BlogPostCard>
          ))}
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const query =
    '*[_type == "post"] | order(_createdAt asc) {title, ingress, _id, _createdAt, _updatedAt, categories[]->{title, slug}}';

  const posts: BlogPost[] = ((await sanityClient.fetch(query)) as BlogPost[]).map((current) => ({
    ...current,
    postedDate: format(new Date(current._createdAt), defaultDateFormat),
  }));

  return {
    props: { posts: posts },
    revalidate: config.defaultRevalidateTime,
  };
};

export default Home;
