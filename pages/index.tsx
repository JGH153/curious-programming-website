import { format } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Card } from "../components/Card";
import { HomeInfoSection } from "../components/HomeInfoSection";
import { LinkGradient } from "../components/LinkGradient";
import { config } from "../shared/config";
import { defaultDateFormat } from "../shared/dateHelpers";
import { sanityClient } from "../shared/sanityClient";

interface BlogPost {
  title: string;
  ingress: string;
  postedDate: string;
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
        <title>Curious Programming</title>
      </Head>
      <HomeInfoSection />
      <section>
        {/* List off posts */}
        <div className="flex flex-col space-y-4">
          {props.posts.map((current: BlogPost) => (
            <Card
              title={current.title}
              key={current.title}
              actionContent={<LinkGradient href={"/post/" + current._id}>Read More &raquo;</LinkGradient>}
            >
              <div className=""> Published: {current.postedDate}</div>
              {current.ingress}
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const query = '*[_type == "post"] | order(_createdAt asc) {title, ingress, _id, _createdAt, _updatedAt}';
  // const params = { minSeats: 2 };

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
