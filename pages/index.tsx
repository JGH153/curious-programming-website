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
import styles from "../styles/Home.module.css";

interface BlogPost {
  title: string;
  ingress: string;
  _id: string;
}

const Home: NextPage = (props: any) => {
  // console.log("props", props);

  return (
    <>
      {" "}
      123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse tenetur eaque omnis eum rem. Ex voluptas, iste
      aperiam eligendi magni harum minus iusto consectetur earum fugiat praesentium quos tenetur veniam.
      <HomeInfoSection />
      <section>
        {/* List off posts */}
        <div className="flex flex-col space-y-4">
          {props.posts.map((current: BlogPost) => (
            <Card
              title={current.title}
              key={current.title}
              actionContent={
                <LinkGradient
                  label={current._id}
                  href={"/post/" + current._id}
                />
              }
            >
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

  const posts: BlogPost[] = await sanityClient.fetch(query);

  return {
    props: { posts: posts }, // will be passed to the page component as props
  };
};

export default Home;
