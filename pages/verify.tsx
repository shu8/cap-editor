import Head from "next/head";

import styles from "../styles/Verify.module.css";
import { ERRORS } from "../lib/errors";
import prisma from "../lib/prisma";
import { Button, Message, Modal, TagPicker } from "rsuite";
import { GetServerSideProps } from "next";
import { useState } from "react";

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

  const userToBeVerified = await prisma.user.findFirst({
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
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roles, setRoles] = useState([]);

  const verifyUser = (verified: boolean) => {
    fetch("/api/verifyUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verificationToken,
        verified,
        roles,
      }),
    });
  };

  return (
    <>
      <Head>
        <title>CAP Editor | Verify User</title>
      </Head>

      {showRoleModal && (
        <Modal open={showRoleModal} onClose={() => setShowRoleModal(false)}>
          <Modal.Header>
            <Modal.Title>User Roles</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please select the role(s) for this user:</p>
            <TagPicker
              block
              cleanable={false}
              searchable={false}
              value={roles}
              placeholder="Select role(s): Admin/Editor/Validator"
              onChange={(v) => setRoles(v)}
              data={[
                { label: "Admin", value: "ADMIN" },
                { label: "Editor", value: "EDITOR" },
                { label: "Validator", value: "VALIDATOR" },
              ]}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              appearance="ghost"
              color="red"
              onClick={() => setShowRoleModal(false)}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              color="green"
              onClick={() => verifyUser(true)}
            >
              Activate this user&apos;s account
            </Button>
          </Modal.Footer>
        </Modal>
      )}

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
              onClick={() => setShowRoleModal(true)}
            >
              Yes, this user is part of my Alerting Authority.
            </Button>
          </p>
        </Message>
      </main>
    </>
  );
}
