import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { Button, Form } from "rsuite";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>CAP Editor - Edit</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Form
          onSubmit={(_, e) => {
            e.preventDefault();

            const formData = new FormData(e.target as HTMLFormElement);
            const formProps = Object.fromEntries(formData);

            fetch("/api/alerts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sender: formProps.email,
                status: formProps.status,
                msgType: formProps.msgType,
                scope: formProps.scope,
                info: {
                  category: formProps.category,
                  event: formProps.event,
                  urgency: formProps.urgency,
                  severity: formProps.severity,
                  certainty: formProps.certainty,
                  resourceDesc: formProps.resourceDesc,
                  areaDesc: formProps.areaDesc,
                },
              }),
            });
          }}
        >
          <Form.Group>
            <Form.ControlLabel>Sender</Form.ControlLabel>
            <Form.Control
              name="email"
              type="email"
              placeholder="me@example.com"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Status</Form.ControlLabel>
            <Form.Control name="status" value="Test" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Message Type</Form.ControlLabel>
            <Form.Control name="msgType" value="Alert" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Scope</Form.ControlLabel>
            <Form.Control name="scope" value="Public" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Category</Form.ControlLabel>
            <Form.Control name="category" value="Met" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Event</Form.ControlLabel>
            <Form.Control name="event" value="flood" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Urgency</Form.ControlLabel>
            <Form.Control name="urgency" value="expected" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Severity</Form.ControlLabel>
            <Form.Control name="severity" value="Minor" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Certainty</Form.ControlLabel>
            <Form.Control name="certainty" value="Possible" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Resource Description</Form.ControlLabel>
            <Form.Control name="resourceDesc" value="Image file" />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Area Description</Form.ControlLabel>
            <Form.Control name="areaDesc" value="London, England, UK" />
          </Form.Group>
          <Form.Group>
            <Button appearance="primary" type="submit">
              Next
            </Button>
          </Form.Group>
        </Form>
      </main>
    </>
  );
}
