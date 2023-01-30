import "rsuite/dist/rsuite.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import Header from "../components/Header";
import Footer from "../components/Footer";
import getCatalog from "../locales/catalogs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { locale = "en" } = useRouter();

  useEffect(() => {
    async function load(locale: string) {
      i18n.load(locale, (await getCatalog(locale)).messages);
      i18n.activate(locale);
    }
    load(locale);
  }, [locale]);

  return (
    <SessionProvider session={session}>
      <div className="wrapper">
        <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </I18nProvider>
      </div>
    </SessionProvider>
  );
}
