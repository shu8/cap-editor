import Head from "next/head";
import RegisterForm from "../components/RegisterForm";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  console.log(router.query.email as string);
  return (
    <>
      <Head>
        <title>CAP Editor | Register</title>
      </Head>
      <main>
        <RegisterForm
          email={router.query.email ? (router.query.email as string) : ""}
        />
      </main>
    </>
  );
}
