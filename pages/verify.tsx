import { t, Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { Button, Input, Message, Modal, TagPicker } from "rsuite";

import ErrorMessage from "../components/ErrorMessage";
import { ERRORS } from "../lib/errors";
import { HandledError } from "../lib/helpers.client";
import { hash } from "../lib/helpers.server";
import prisma from "../lib/prisma";
import { useToasterI18n } from "../lib/useToasterI18n";
import styles from "../styles/Verify.module.css";
import { useLingui } from "@lingui/react";

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

  const { token: verificationToken } = context.query;
  if (typeof verificationToken !== "string") {
    return { redirect };
  }

  const userAndAlertingAuthority =
    await prisma.userAlertingAuthorities.findFirst({
      where: { verificationToken: hash(verificationToken) },
      include: {
        AlertingAuthority: { select: { name: true, id: true } },
        User: { select: { email: true, name: true } },
      },
    });

  if (!userAndAlertingAuthority) return { redirect };

  return {
    props: {
      userToBeVerified: {
        email: userAndAlertingAuthority.User.email,
        name: userAndAlertingAuthority.User.name!,
        alertingAuthority: {
          id: userAndAlertingAuthority.AlertingAuthority.id,
          name: userAndAlertingAuthority.AlertingAuthority.name,
        },
      },
      verificationToken,
    },
  };
};

export default function VerifyUser({
  userToBeVerified,
  verificationToken,
}: Props) {
  useLingui();

  const toaster = useToasterI18n();
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
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        toaster.push(
          <Message type="success" closable>
            <Trans>Account successfully</Trans>{" "}
            {verified ? t`approved` : t`rejected`}
          </Message>,
          { duration: 5000 }
        );
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage error={err} action={t`verifying the account`} />
        )
      );
  };

  /**
   * Whether the user chose 'other' as their AA, and therefore needing approval from the IFRC
   */
  const isOtherAA = userToBeVerified.alertingAuthority.id.startsWith("ifrc:");

  return (
    <>
      <Head>
        <title>CAP Editor | Verify User</title>
      </Head>

      {showRoleModal && (
        <Modal open={showRoleModal} onClose={() => setShowRoleModal(false)}>
          <Modal.Header>
            <Modal.Title>
              <Trans>User Roles</Trans>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <Trans>Please select the role(s) for this user</Trans>:
            </p>
            <TagPicker
              block
              cleanable={false}
              searchable={false}
              value={roles}
              placeholder={t`Select role(s): Admin/Composer/Approver`}
              onChange={(v) => setRoles(v)}
              data={[
                { label: t`Admin`, value: "ADMIN" },
                { label: t`Composer`, value: "COMPOSER" },
                { label: t`Approver`, value: "APPROVER" },
              ]}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              appearance="ghost"
              color="red"
              onClick={() => setShowRoleModal(false)}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              appearance="primary"
              color="green"
              onClick={() => verifyUser(true)}
            >
              <Trans>Approve this user</Trans>
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
              <strong>
                <Trans>Verify User</Trans>
              </strong>{" "}
              (<i>{userToBeVerified.alertingAuthority.name}</i>)
            </>
          }
        >
          {isOtherAA ? (
            <p>
              <Trans>
                The following user has requested to register with the CAP
                Editor. They have been unable to locate their Alerting Authority
                in the{" "}
                <a
                  href="https://alertingauthority.wmo.int/"
                  target="_blank"
                  rel="noreferrer"
                >
                  WMO Register of Alerting Authorities
                </a>{" "}
                so have requested their account be manually verified by the
                IFRC.
              </Trans>
              <br />
              <Trans>
                <strong>
                  If you believe there is already an appropriate Alerting
                  Authority within the WMO Register of Alerting Authorities
                </strong>
                , please choose the "No" option below and ask the user to
                connect to the correct Alerting Authority.
              </Trans>
            </p>
          ) : (
            <p>
              <Trans>
                The following user has requested to register with the CAP
                Editor. Please confirm they are part of your Alerting Authority
                (<i>{userToBeVerified.alertingAuthority.id}</i>) to enable their
                account.
              </Trans>
            </p>
          )}

          <ul className={styles.list}>
            <li>
              <Trans>Name</Trans>: {userToBeVerified.name}
            </li>
            <li>
              <Trans>Email</Trans>: {userToBeVerified.email}
            </li>
          </ul>

          <p className={styles.buttons}>
            <Button
              appearance="primary"
              color="red"
              onClick={() => verifyUser(false)}
            >
              <Trans>
                No, this user is not a part of my Alerting Authority:
                <br />
                Do not activate their account.
              </Trans>
            </Button>

            <Button
              appearance="primary"
              color="green"
              onClick={() => setShowRoleModal(true)}
            >
              <Trans>Yes, this user is part of my Alerting Authority.</Trans>
            </Button>
          </p>
        </Message>
      </main>
    </>
  );
}
