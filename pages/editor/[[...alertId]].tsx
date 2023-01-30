import Head from "next/head";
import Editor, { FormAlertData } from "../../components/editor/Editor";
import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import { GetServerSideProps } from "next";

import {
  formatDate,
  getStartOfToday,
  HandledError,
  useMountEffect,
} from "../../lib/helpers.client";
import { authOptions } from "../api/auth/[...nextauth]";
import { CAPV12JSONSchema } from "../../lib/types/cap.schema";
import { ERRORS } from "../../lib/errors";
import { Message, useToaster } from "rsuite";
import ErrorMessage from "../../components/ErrorMessage";
import { useRouter } from "next/router";
import { t } from "@lingui/macro";

type Props = {
  alertingAuthority: AlertingAuthority;
  roles: Role[];
  defaultAlertData: FormAlertData & { from: string; to: string };
  editingAlert: { id: string; status: AlertStatus };
};

const redirect = (url: string) => ({
  redirect: { destination: url, permanent: false },
});

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) return redirect("/login");

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: { alertingAuthority: true },
  });
  if (!user) return redirect("/login");

  // First, check if user wants to edit an alert through /editor/ID
  let { alertId } = context.query;
  // Next.js returns catch-all route params as array
  if (alertId) alertId = alertId[0];

  // If they're not looking to edit one, they must be looking to create one
  // Validators are not allowed to create new alerts -- they can only edit
  if (
    !alertId &&
    !session.user.roles.includes("ADMIN") &&
    !session.user.roles.includes("EDITOR")
  ) {
    return redirect(`/error/${ERRORS.NOT_ALLOWED_CREATE_ALERTS.slug}`);
  }

  let isTemplate = false;
  // Next, check if Admins/Editors want to use an existing alert as a template through /editor?template=ID
  if (!alertId) {
    alertId = context.query?.template;
    if (alertId) isTemplate = true;
  }

  let defaultAlertData: any;
  let editingAlert: any = null;
  if (typeof alertId === "string") {
    const alert = await prisma.alert.findFirst({ where: { id: alertId } });
    if (!alert) return redirect(`/error/${ERRORS.ALERT_NOT_FOUND.slug}`);

    if (alert.status === "PUBLISHED" && !isTemplate) {
      return redirect(`/error/${ERRORS.EDIT_PUBLISHED_ALERT.slug}`);
    }

    // Convert DB Alert data to FormAlertData for Editor
    const alertData = alert.data as CAPV12JSONSchema;
    const info = alertData.info?.[0];

    defaultAlertData = {
      category: info?.category ?? [],
      regions: info?.area?.reduce((acc, area) => {
        acc[area.areaDesc] = area.circle ?? area.polygon;
        return acc;
      }, {}),
      from: (info?.effective
        ? new Date(info?.effective)
        : getStartOfToday()
      ).toString(),
      to: (info?.expires ? new Date(info?.expires) : new Date()).toString(),
      actions: info?.responseType ?? [],
      certainty: info?.certainty ?? "",
      severity: info?.severity ?? "",
      urgency: info?.urgency ?? "",
      status: alertData.status,
      msgType: alertData.msgType,
      scope: alertData.scope,
      restriction: alertData.restriction ?? "",
      addresses: alertData.addresses
        ? alertData.addresses?.match(/\w+|"[^"]+"/g) ?? []
        : [],
      references: alertData.references ? alertData.references.split(" ") : [],
      textLanguages: alertData.info?.reduce((acc, info) => {
        acc[info.language as string] = {
          event: info.event ?? "",
          headline: info.headline ?? "",
          description: info.description ?? "",
          instruction: info.instruction ?? "",
          resources: info.resource ?? [],
        };
        return acc;
      }, {}),
    };

    if (!isTemplate) {
      defaultAlertData.identifier = alertData.identifier;
      editingAlert = { id: alertData.identifier, status: alert.status };
    }
  } else {
    defaultAlertData = {
      category: [],
      regions: {},
      from: getStartOfToday().toString(),
      to: new Date().toString(),
      actions: [],
      certainty: "",
      severity: "",
      urgency: "",
      status: "",
      msgType: "",
      scope: "",
      restriction: "",
      addresses: [],
      references: [],
      textLanguages: {
        en: {
          event: "",
          headline: "",
          description: "",
          instruction: "",
          resources: [],
        },
      },
    };
  }

  return {
    props: {
      alertingAuthority: user.alertingAuthority,
      roles: user.roles,
      defaultAlertData,
      editingAlert,
    },
  };
};

export default function EditorPage(props: Props) {
  // Dates were serialised on server; convert back to Date now
  const defaultAlertData: FormAlertData = {
    ...props.defaultAlertData,
    from: new Date(props.defaultAlertData.from),
    to: new Date(props.defaultAlertData.to),
  };

  const toaster = useToaster();
  const router = useRouter();

  // If ?template query param exists, hide it from user
  useMountEffect(() => {
    if (router.query.template) {
      router.replace("/editor", undefined, { shallow: true });
    }
  });

  return (
    <>
      <Head>
        <title>CAP Editor - Edit</title>
      </Head>
      <main>
        <Editor
          key={
            props.editingAlert
              ? `editor-${props.editingAlert.id}`
              : `editor-${new Date().getTime()}`
          }
          alertingAuthority={props.alertingAuthority}
          roles={props.roles}
          defaultAlertData={defaultAlertData}
          {...(props.editingAlert && {
            existingAlertStatus: props.editingAlert.status,
          })}
          onSubmit={async (
            alertData: FormAlertData,
            alertStatus: AlertStatus
          ) => {
            fetch(
              props.editingAlert
                ? `/api/alerts/${props.editingAlert.id}`
                : "/api/alerts",
              {
                method: props.editingAlert ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                  { status: alertStatus, data: alertData },
                  function (k, v) {
                    return this[k] instanceof Date ? formatDate(this[k]) : v;
                  }
                ),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                if (res.error) throw new HandledError(res.message);
                toaster.push(
                  <Message type="success" duration={0} showIcon closable>
                    Alert successfully submitted.
                  </Message>,
                  { placement: "bottomCenter" }
                );
              })
              .catch((err) =>
                toaster.push(
                  <ErrorMessage error={err} action={t`submitting the alert`} />,
                  { placement: "bottomCenter" }
                )
              );
          }}
        />
      </main>
    </>
  );
}
