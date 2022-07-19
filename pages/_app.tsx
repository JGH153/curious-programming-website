import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/layout/layout";
import { useEffect } from "react";
import LogRocket from "logrocket";
import { config } from "../shared/config";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      LogRocket.init(config.logRocketProject);
    }
  });

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={config.reCaptchaKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
