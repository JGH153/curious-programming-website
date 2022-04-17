import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Header } from "../components/header";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className="flex justify-center align-top">
      <div className="max-w-4xl">
        <Header />
        <main>123 Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse tenetur eaque omnis eum rem. Ex voluptas, iste aperiam eligendi magni harum minus iusto consectetur earum fugiat praesentium quos tenetur veniam.</main>
        {/* 
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
      </div>
    </div>
  );
};

export default Home;
