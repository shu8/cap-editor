import { Trans } from "@lingui/macro";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "rsuite";

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
          <span className={styles.text}>CAP Editor</span>
        </h1>
      </Link>

      <div>
        {session && (
          <>
            <AlertingAuthoritySelector
              alertingAuthorities={session.user.alertingAuthorities}
              appendToQuery={false}
              fullWidth={false}
            />

            <Link href={`/editor?alertingAuthority=${alertingAuthorityId}`}>
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                <Trans>Create alert</Trans>
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                <Trans>Settings</Trans>
              </Button>
            </Link>

            <Button
              appearance="ghost"
              color="violet"
              className={styles.button}
              onClick={() => signOut()}
            >
              <Trans>Logout</Trans>
            </Button>
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
