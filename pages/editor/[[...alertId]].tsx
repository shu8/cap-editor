import Head from "next/head";
import Editor, { FormAlertData } from "../../components/editor/Editor";
import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { Alert, AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getStartOfToday } from "../../lib/helpers";
import { CAPV12JSONSchema } from "../../lib/types/cap.schema";
import { ERRORS } from "../../lib/errors";

type Props = {
  alertingAuthority: AlertingAuthority;
  roles: Role[];
  alert?: Alert;
  isTemplate: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: { alertingAuthority: true },
  });

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const ret: { props: Props } = {
    props: {
      alertingAuthority: user?.alertingAuthority,
      roles: user?.roles,
      isTemplate: false,
    },
  };

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
    return {
      redirect: {
        destination: `/error/${ERRORS.NOT_ALLOWED_CREATE_ALERTS.slug}`,
        permanent: false,
      },
    };
  }

  // Next, check if Admins/Editors want to use an existing alert as a template through /editor?template=ID
  if (!alertId) {
    ret.props.isTemplate = true;
    alertId = context.params?.template;
  }

  if (typeof alertId === "string") {
    const alert = await prisma.alert.findFirst({ where: { id: alertId } });
    if (!alert) {
      return {
        redirect: {
          destination: `/error/${ERRORS.ALERT_NOT_FOUND.slug}`,
          permanent: false,
        },
      };
    }

    ret.props.alert = alert;
  }

  return ret;
};

export default function EditorPage(props: Props) {
  let defaultAlertData;

  if (props.alert) {
    // Convert DB Alert data to FormAlertData for Editor
    const alertData = props.alert.data as CAPV12JSONSchema;
    const info = alertData.info?.[0];

    defaultAlertData = {
      ...(!props.isTemplate && { identifier: alertData.identifier }),
      category: info?.category ?? [],
      regions:
        info?.area?.reduce((acc, area, i) => {
          const areaDescriptions = area.areaDesc.split(", ");
          if (area.circle) {
            // TODO map circles into format so they are shown on map
            acc[areaDescriptions.find((a) => a.startsWith("custom")) ?? i] =
              area.circle;
          }
          if (area.polygon) {
            acc[areaDescriptions.find((a) => !a.startsWith("custom")) ?? i] =
              area.polygon;
          }

          return acc;
        }, {}) ?? {},
      from: info?.effective ? new Date(info?.effective) : getStartOfToday(),
      to: info?.expires ? new Date(info?.expires) : new Date(),
      headline: info?.headline ?? "",
      description: info?.description ?? "",
      instruction: info?.instruction ?? "",
      actions: info?.responseType ?? [],
      certainty: info?.certainty ?? "",
      severity: info?.severity ?? "",
      urgency: info?.urgency ?? "",
      status: alertData.status,
      msgType: alertData.msgType,
      scope: alertData.scope,
      restriction: alertData.restriction ?? "",
      addresses: alertData.addresses?.match(/\w+|"[^"]+"/g) ?? [],
      references: alertData.references?.split(" ") ?? [],
      event: info?.event ?? "",
    };
  } else {
    defaultAlertData = {
      category: ["Geo"],
      regions: { "United Kingdom": [] },
      from: getStartOfToday(),
      to: new Date(),
      headline: "",
      description: "",
      instruction: "",
      actions: [],
      certainty: "Likely",
      severity: "Severe",
      urgency: "Immediate",
      status: "Actual",
      msgType: "Alert",
      scope: "Public",
      restriction: "",
      addresses: [],
      references: [],
      event: "Test",
    };
  }

  return (
    <>
      <Head>
        <title>CAP Editor - Edit</title>
      </Head>
      <main>
        <Editor
          key={
            props.alert
              ? `editor-${props.alert.id}`
              : `editor-${new Date().getTime()}`
          }
          alertingAuthority={props.alertingAuthority}
          roles={props.roles}
          defaultAlertData={defaultAlertData}
          {...(!!props.alert && { existingAlertStatus: props.alert.status })}
          onSubmit={async (
            alertData: FormAlertData,
            alertStatus: AlertStatus
          ) => {
            fetch(
              props.alert ? `/api/alerts/${props.alert.id}` : "/api/alerts",
              {
                method: props.alert ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: alertStatus, data: alertData }),
              }
            );
          }}
        />
      </main>
    </>
  );
}
