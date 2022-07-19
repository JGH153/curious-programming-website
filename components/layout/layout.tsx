import Head from "next/head";
import Script from "next/script";
import { ReactNode, useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./header";
import LogRocket from "logrocket";
import { config } from "../../shared/config";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* For recaptcha enterprise */}
      {/* <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`}
      ></Script> */}

      <div className="flex justify-center align-top">
        <div className="max-w-4xl p-3 lg:p-0">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
