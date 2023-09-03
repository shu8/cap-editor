import { Trans, t } from "@lingui/macro";
import { Form, Message } from "rsuite";
import { HandledError } from "../../../lib/helpers.client";
import { useToasterI18n } from "../../../lib/useToasterI18n";
import KeyValueInput from "../../KeyValueInput";
import { FieldProps } from "./common";
import { useLingui } from "@lingui/react";

export default function Resources({ onUpdate, alertData }: FieldProps) {
  useLingui();
  const toaster = useToasterI18n();

  const getMimeType = async (url: string): Promise<string> => {
    const res = await fetch("/api/mime?" + new URLSearchParams({ url })).then(
      (res) => res.json()
    );
    if (res.error) throw new HandledError(res.message);
    return res.mime;
  };

  return (
    <Form.Group>
      <Form.ControlLabel>
        <Trans>Resources</Trans>{" "}
        <KeyValueInput
          keyLabel={t`Description`}
          valueLabel={t`URL`}
          addLabel={t`Add URL?`}
          allowImageUploadValue
          emptyLabel={
            <Form.HelpText>
              <Trans>No resources added yet</Trans>
            </Form.HelpText>
          }
          values={alertData.resources.reduce((acc, cur) => {
            acc[cur.resourceDesc] = cur.uri;
            return acc;
          }, {})}
          onChange={async (newResources) => {
            const resourceDescriptions = Object.keys(newResources);
            const resourceMimeTypes = await Promise.allSettled(
              resourceDescriptions.map((desc) =>
                getMimeType(newResources[desc])
              )
            );

            const resources = [];
            let hasError = false;
            for (let i = 0; i < resourceMimeTypes.length; i++) {
              if (resourceMimeTypes[i].status === "fulfilled") {
                resources.push({
                  resourceDesc: resourceDescriptions[i],
                  uri: newResources[resourceDescriptions[i]],
                  mimeType: resourceMimeTypes[i].value,
                });
              } else {
                hasError = true;
              }
            }

            if (hasError) {
              toaster.push(
                <Message type="error" closable>
                  <Trans>
                    There was an error accessing one or more resources. They may
                    be currently unavailable.
                  </Trans>
                </Message>,
                { duration: 0 }
              );
            } else {
              toaster.push(
                <Message type="success" closable>
                  <Trans>Resource added.</Trans>
                </Message>,
                { duration: 2000 }
              );
            }

            onUpdate({ resources });
          }}
        />
      </Form.ControlLabel>
    </Form.Group>
  );
}
