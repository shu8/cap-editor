import { useRouter } from "next/router";
import { useContext } from "react";
import { Button, ButtonToolbar, Panel } from "rsuite";
import EditorContext from "../lib/EditorContext";
import { getStartOfToday } from "../lib/helpers";
import { CAPV12JSONSchema } from "../lib/types/cap.schema";

export default function Alert({ capAlert }: { capAlert: CAPV12JSONSchema }) {
  const info = capAlert.info?.[0];
  const { setAlertData } = useContext(EditorContext);
  const router = useRouter();

  return (
    <Panel
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
            console.log(capAlert);
            setAlertData({
              category: info?.category ?? [],
              regions:
                info?.area?.reduce((acc, area, i) => {
                  console.log(acc, area, i);
                  const areaDescriptions = area.areaDesc.split(", ");
                  if (area.circle) {
                    // TODO map circles into format so they are shown on map
                    acc[
                      areaDescriptions.find((a) => a.startsWith("custom")) ?? i
                    ] = area.circle;
                  }
                  if (area.polygon) {
                    acc[
                      areaDescriptions.find((a) => !a.startsWith("custom")) ?? i
                    ] = area.polygon;
                  }

                  return acc;
                }, {}) ?? {},
              from: info?.effective
                ? new Date(info?.effective)
                : getStartOfToday(),
              to: info?.expires ? new Date(info?.expires) : new Date(),
              headline: info?.headline ?? "",
              description: info?.description ?? "",
              instruction: info?.instruction ?? "",
              actions: info?.responseType ?? [],
              certainty: info?.certainty ?? "",
              severity: info?.severity ?? "",
              urgency: info?.urgency ?? "",
              status: capAlert.status,
              msgType: capAlert.msgType,
              scope: capAlert.scope,
              restriction: capAlert.restriction ?? "",
              addresses: capAlert.addresses?.match(/\w+|"[^"]+"/g) ?? [],
              references: capAlert.references?.split(" ") ?? [],
              event: info?.event ?? "",
            });
            router.push("/editor");
          }}
        >
          Use as template for new alert
        </Button>
      </ButtonToolbar>
    </Panel>
  );
}
