import Head from "next/head";

import styles from "../styles/Verify.module.css";
import { ERRORS } from "../lib/errors";
import prisma from "../lib/prisma";
import { Button, Input, Message, Modal, TagPicker } from "rsuite";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { HandledError } from "../lib/helpers.client";
import ErrorMessage from "../components/ErrorMessage";
import { t, Trans } from "@lingui/macro";
import { useToasterI18n } from "../lib/useToasterI18n";

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

  const userAndAlertingAuthority =
    await prisma.userAlertingAuthorities.findFirst({
      where: { alertingAuthorityVerificationToken },
      include: {
        alertingAuthority: { select: { name: true, id: true } },
        user: { select: { email: true, name: true } },
      },
    });

  if (!userAndAlertingAuthority) return { redirect };

  return {
    props: {
      userToBeVerified: {
        email: userAndAlertingAuthority.user.email,
        name: userAndAlertingAuthority.user.name,
        alertingAuthority: {
          id: userAndAlertingAuthority.alertingAuthority.id,
          name: userAndAlertingAuthority.alertingAuthority.name,
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
  const toaster = useToasterI18n();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [nameOtherAA, setNameOtherAA] = useState("");

  const verifyUser = (verified: boolean) => {
    fetch("/api/verifyUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verificationToken,
        verified,
        roles,
        ...(isOtherAA && { name: nameOtherAA }),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        toaster.push(
          <Message type="success" duration={0} closable>
            <Trans>Account successfully verified</Trans>
          </Message>
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
            {isOtherAA && (
              <>
                <p>
                  <Trans>
                    Please enter the name of this new IFRC-managed 'Alerting
                    Authority'
                  </Trans>
                  :
                </p>
                <Input
                  value={nameOtherAA}
                  onChange={(v) => setNameOtherAA(v)}
                  placeholder="e.g., Bermuda"
                />
                <br />
              </>
            )}
            <p>
              <Trans>Please select the role(s) for this user</Trans>:
            </p>
            <TagPicker
              block
              cleanable={false}
              searchable={false}
              value={roles}
              placeholder={t`Select role(s): Admin/Editor/Validator`}
              onChange={(v) => setRoles(v)}
              data={[
                { label: t`Admin`, value: "ADMIN" },
                { label: t`Editor`, value: "EDITOR" },
                { label: t`Validator`, value: "VALIDATOR" },
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
