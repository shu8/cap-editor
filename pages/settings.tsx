import { startRegistration } from "@simplewebauthn/browser";
import { Button, useToaster } from "rsuite";
import Head from "next/head";
import ErrorMessage from "../components/ErrorMessage";

export default function SettingsPage() {
  const toaster = useToaster();

  return (
    <>
      <Head>
        <title>CAP Editor - Settings</title>
      </Head>

      <main>
        <h2>Settings</h2>
        <Button
          appearance="primary"
          style={{ width: "200px" }}
          onClick={async () => {
            try {
              const options = await fetch("/api/webauthn/register").then(
                (res) => res.json()
              );
              const credential = await startRegistration(options);
              const verification = await fetch("/api/webauthn/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credential),
              }).then((res) => res.json());

              if (verification?.verified) window.alert("Registered");
            } catch (err) {
              console.error("Failed to register WebAuthn", err);
              toaster.push(
                <ErrorMessage error={err} action="registering for WebAuthn" />
              );
            }
          }}
        >
          Register WebAuthn
        </Button>
      </main>
    </>
  );
}
