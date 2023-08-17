import { Trans } from "@lingui/macro";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button, Divider } from "rsuite";

import { useAlertingAuthorityLocalStorage } from "../lib/useLocalStorageState";
import styles from "../styles/components/Header.module.css";
import AlertingAuthoritySelector from "./AlertingAuthoritySelector";

export default function Header() {
  const { data: session } = useSession();
  const [alertingAuthorityId] = useAlertingAuthorityLocalStorage();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        <h1 className={styles.header}>
          <Image
            src="/cap.png"
            width="230"
            height="80"
            alt="CAP Logo"
            priority
          />
        </h1>
      </Link>
      <div className={styles.text}>
        <span>
          Compose and view Common Alerting Protocol (CAP) Public Alerts
        </span>
        {session && (
          <span>
            for
            <AlertingAuthoritySelector
              alertingAuthorities={session.user.alertingAuthorities}
              appendToQuery={false}
              fullWidth
            />
          </span>
        )}
      </div>

      <div style={{ display: "flex" }}>
        {session && (
          <>
            <div className={styles.userDetails}>
              <span>{session.user.email}</span>
              <span>
                {session.user.alertingAuthorities?.[alertingAuthorityId]?.roles
                  ?.join(", ")
                  .toLowerCase()}
              </span>
              <div>
                <Button
                  className="noPadding"
                  appearance="link"
                  color="violet"
                  size="sm"
                  href="/settings"
                >
                  Settings
                </Button>
                <Divider vertical />
                <Button
                  className="noPadding"
                  appearance="link"
                  color="violet"
                  size="sm"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            </div>
          </>
        )}

        {!session && (
          <>
            <Link href="/register" className={styles.button}>
              <Button
                appearance="primary"
                color="violet"
                className={styles.button}
              >
                <Trans>Register</Trans>
              </Button>
            </Link>
            <Link href="/login" className={styles.button}>
              <Button
                appearance="primary"
                color="violet"
                className={styles.button}
              >
                <Trans>Login</Trans>
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
