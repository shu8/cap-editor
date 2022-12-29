import "rsuite/dist/rsuite.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { EditorContextProvider } from "../lib/EditorContext";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="wrapper">
        <Header />
        <EditorContextProvider>
          <Component {...pageProps} />
        </EditorContextProvider>
        <Footer />
      </div>
    </SessionProvider>
  );
}
