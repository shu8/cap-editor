import "rsuite/dist/rsuite.min.css";
import "../styles/globals.css";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import getCatalog from "../locales/catalogs";

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
