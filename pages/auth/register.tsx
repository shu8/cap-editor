import Head from "next/head";
import RegisterForm from "../../components/RegisterForm";
import { unstable_getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) return { redirect: { destination: "/", permanent: false } };

  const { email } = context.query;
  if (typeof email === "string") return { props: { email } };
  return { props: {} };
};

export default function Register({ email }: { email?: string }) {
  return (
    <>
      <Head>
        <title>CAP Editor | Register</title>
      </Head>
      <main>
        <RegisterForm email={email ?? ""} />
      </main>
    </>
  );
}
