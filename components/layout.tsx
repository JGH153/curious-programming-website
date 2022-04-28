import { ReactNode } from "react";
import { Header } from "./header";

export function Layout({ children }: { children: ReactNode  }) {
  return (
    <div className="flex justify-center align-top">
      <div className="max-w-4xl">
        <Header />
        <main>{children}</main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
