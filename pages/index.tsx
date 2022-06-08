import { format } from "date-fns";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "../api/sanityClient";
import { ButtonGradient } from "../components/ButtonGradient";
import { Card } from "../components/Card";
import { Header } from "../components/header";
import { HomeInfoSection } from "../components/HomeInfoSection";
import { LinkGradient } from "../components/LinkGradient";
import { defaultDateFormat } from "../shared/dateHelpers";
import styles from "../styles/Home.module.css";

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
  const query = '*[_type == "post"] {title, ingress, _id, _createdAt, _updatedAt}';
  // const params = { minSeats: 2 };

  const posts: BlogPost[] = ((await sanityClient.fetch(query)) as BlogPost[]).map((current) => ({
    ...current,
    postedDate: format(new Date(current._createdAt), defaultDateFormat),
  }));

  return {
    props: { posts: posts }, // will be passed to the page component as props
  };
};

export default Home;
