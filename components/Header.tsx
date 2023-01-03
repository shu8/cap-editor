import styles from "../styles/components/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "rsuite";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        <h1 className={styles.header}>
          <Image src="/cap.png" width="230" height="80" alt="CAP Logo" />
          <span className={styles.text}>CAP Editor</span>
        </h1>
      </Link>

      <div>
        {session && (
          <>
            <Link href="/editor">
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                Create alert
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                Settings
              </Button>
            </Link>

            <Button
              appearance="ghost"
              color="violet"
              className={styles.button}
              onClick={() => signOut()}
            >
              Logout
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
                Register
              </Button>
            </Link>
            <Link href="/login" className={styles.button}>
              <Button
                appearance="primary"
                color="violet"
                className={styles.button}
              >
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
