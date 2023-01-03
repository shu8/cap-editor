import Head from "next/head";
import Editor, { FormAlertData } from "../../components/editor/Editor";
import prisma from "../../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { Alert, AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import { GetServerSideProps } from "next";
import ISO6391 from "iso-639-1";

import {
  formatDate,
  getStartOfToday,
  HandledError,
  useMountEffect,
} from "../../lib/helpers";
import { authOptions } from "../api/auth/[...nextauth]";
import { CAPV12JSONSchema } from "../../lib/types/cap.schema";
import { ERRORS } from "../../lib/errors";
import { Message, useToaster } from "rsuite";
import ErrorMessage from "../../components/ErrorMessage";
import { useRouter } from "next/router";

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
    alertId = context.query?.template;
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
  console.log(props);
  const toaster = useToaster();
  const router = useRouter();

  // If ?template query param exists, hide it from user
  useMountEffect(() => {
    if (router.query.template) {
      router.replace("/editor", undefined, { shallow: true });
    }
  });

  let defaultAlertData;
  if (props.alert) {
    // Convert DB Alert data to FormAlertData for Editor
    const alertData = props.alert.data as CAPV12JSONSchema;
    const info = alertData.info?.[0];

    defaultAlertData = {
      ...(!props.isTemplate && { identifier: alertData.identifier }),
      category: info?.category ?? [],
      regions: info?.area?.reduce((acc, area) => {
        acc[area.areaDesc] = area.circle ?? area.polygon;
        return acc;
      }, {}),
      from: info?.effective ? new Date(info?.effective) : getStartOfToday(),
      to: info?.expires ? new Date(info?.expires) : new Date(),
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
      resources: info?.resource ?? [],
      references: alertData.references ? alertData.references.split(" ") : [],
      event: info?.event ?? "",
      textLanguages: alertData.info?.reduce((acc, info) => {
        acc[info.language as string] = {
          headline: info.headline ?? "",
          description: info.description ?? "",
          instruction: info.description ?? "",
        };
        return acc;
      }, {}),
    };
  } else {
    defaultAlertData = {
      category: ["Geo"],
      regions: { "United Kingdom": [] },
      from: getStartOfToday(),
      to: new Date(),
      actions: [],
      certainty: "Likely",
      severity: "Severe",
      urgency: "Immediate",
      status: "Actual",
      msgType: "Alert",
      scope: "Public",
      restriction: "",
      addresses: [],
      resources: [],
      references: [],
      event: "Test",
      textLanguages: { en: { headline: "", description: "", instruction: "" } },
    };
  }

  const isEditingAlert = !!props.alert && !props.isTemplate;
  return (
    <>
      <Head>
        <title>CAP Editor - Edit</title>
      </Head>
      <main>
        <Editor
          key={
            isEditingAlert
              ? `editor-${props.alert!.id}`
              : `editor-${new Date().getTime()}`
          }
          alertingAuthority={props.alertingAuthority}
          roles={props.roles}
          defaultAlertData={defaultAlertData}
          {...(isEditingAlert && { existingAlertStatus: props.alert!.status })}
          onSubmit={async (
            alertData: FormAlertData,
            alertStatus: AlertStatus
          ) => {
            fetch(
              isEditingAlert ? `/api/alerts/${props.alert!.id}` : "/api/alerts",
              {
                method: isEditingAlert ? "PUT" : "POST",
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
                  <ErrorMessage error={err} action="submitting the alert" />,
                  { placement: "bottomCenter" }
                )
              );
          }}
        />
      </main>
    </>
  );
}
