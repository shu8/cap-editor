import Head from "next/head";

import styles from "../styles/Verify.module.css";
import { ERRORS } from "../lib/errors";
import db from "../lib/db";
import { Button, Message } from "rsuite";
import { GetServerSideProps } from "next";

type Props = {
  userToBeVerified: {
    email: string;
    name: string;
    alertingAuthority: { id: string; name: string };
  };
  verificationToken: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const redirect = {
    destination: `/error/${ERRORS.INVALID_VERIFICATION_TOKEN.slug}`,
    permanent: false,
  };

  const alertingAuthorityVerificationToken = context.query.token;
  if (typeof alertingAuthorityVerificationToken !== "string") {
    return { redirect };
  }

  const userToBeVerified = await db.user.findFirst({
    where: { alertingAuthorityVerificationToken },
    include: { alertingAuthority: { select: { name: true } } },
  });

  if (!userToBeVerified) return { redirect };

  return {
    props: {
      userToBeVerified: {
        email: userToBeVerified.email,
        name: userToBeVerified.name,
        alertingAuthority: {
          id: userToBeVerified.alertingAuthorityId,
          name: userToBeVerified.alertingAuthority.name,
        },
      },
      verificationToken: alertingAuthorityVerificationToken,
    },
  };
};

export default function VerifyUser({
  userToBeVerified,
  verificationToken,
}: Props) {
  const verifyUser = (verified: boolean) => {
    fetch("/api/verifyUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verificationToken,
        verified,
      }),
    });
  };

  return (
    <>
      <Head>
        <title>CAP Editor | Verify User</title>
      </Head>

      <main>
        <Message
          type="info"
          showIcon
          header={
            <>
              <strong>Verify User</strong> (
              <i>{userToBeVerified.alertingAuthority.name}</i>)
            </>
          }
        >
          <p>
            The following user has requested to register with the CAP Editor.
            Please confirm they are part of your Alerting Authority (
            <i>{userToBeVerified.alertingAuthority.id}</i>) to enable their
            account.
          </p>

          <ul className={styles.list}>
            <li>Name: {userToBeVerified.name}</li>
            <li>Email: {userToBeVerified.email}</li>
          </ul>

          <p className={styles.buttons}>
            <Button
              appearance="primary"
              color="red"
              onClick={() => verifyUser(false)}
            >
              No, this user is not a part of my Alerting Authority:
              <br />
              Do not activate their account.
            </Button>

            <Button
              appearance="primary"
              color="green"
              onClick={() => verifyUser(true)}
            >
              Yes, this user is part of my Alerting Authority:
              <br />
              Activate their account.
            </Button>
          </p>
        </Message>
      </main>
    </>
  );
}
