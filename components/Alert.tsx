import { useRouter } from "next/router";
import { useContext } from "react";
import { Button, ButtonToolbar, Panel } from "rsuite";
import EditorContext from "../lib/EditorContext";
import { CAPV12JSONSchema } from "../lib/types/cap.schema";

export default function Alert({ capAlert }: { capAlert: CAPV12JSONSchema }) {
  const info = capAlert.info?.[0];
  const { setAlertData } = useContext(EditorContext);
  const router = useRouter();

  return (
    <Panel
      bordered
      header={
        <>
          {new Date(capAlert.sent).toString()}{" "}
          {!info?.web && (
            <a
              target="_blank"
              href={`/feed/${capAlert.identifier}`}
              rel="noreferrer"
            >
              <Button appearance="ghost" color="violet" size="sm">
                View alert ↗
              </Button>
            </a>
          )}
        </>
      }
    >
      <p>
        <strong>{info?.category.join(", ")}</strong> alert expiring at{" "}
        {new Date(info?.expires).toString()}.
      </p>

      <p>Headline: {info?.headline}</p>

      <ButtonToolbar>
        <Button
          appearance="primary"
          color="violet"
          onClick={() => {
            // TODO convert CAP format to AlertData format
            setAlertData({});
            router.push("/editor");
          }}
        >
          Use as template for new alert
        </Button>
      </ButtonToolbar>
    </Panel>
  );
}
