import Head from "next/head";
import RegisterForm from "../../components/RegisterForm";
import { useRouter } from "next/router";
import { Button } from "rsuite";
import { startRegistration } from "@simplewebauthn/browser";
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

        <Button
          onClick={async () => {
            const options = await fetch("/api/webauthn/register").then((res) =>
              res.json()
            );
            const credential = await startRegistration(options);
            console.log(credential);

            const verification = await fetch("/api/webauthn/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credential),
            }).then((res) => res.json());

            console.log(verification);
            if (verification?.verified) {
              alert("Registered");
            }
          }}
        >
          Register WebAuthn
        </Button>
      </main>
    </>
  );
}
