import { t, Trans } from "@lingui/macro";
import { AlertStatus } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import Editor, { FormAlertData } from "../../components/editor/Editor";
import prisma from "../../lib/prisma";

import AlertingAuthoritySelector from "../../components/AlertingAuthoritySelector";
import ErrorMessage from "../../components/ErrorMessage";
import { ERRORS } from "../../lib/errors";
import {
  formatDate,
  getStartOfToday,
  HandledError,
  useMountEffect,
} from "../../lib/helpers.client";
import { CAPV12JSONSchema } from "../../lib/types/cap.schema";
import { AlertingAuthority } from "../../lib/types/types";
import { useAlertingAuthorityLocalStorage } from "../../lib/useLocalStorageState";
import { useToasterI18n } from "../../lib/useToasterI18n";
import { authOptions } from "../api/auth/[...nextauth]";

type Props = {
  defaultAlertData: (FormAlertData & { from: string; to: string }) | undefined;
  editingAlert: { id: string; status: AlertStatus } | undefined;
  alertingAuthority: AlertingAuthority | undefined;
  isShared: boolean;
};

const redirect = (url: string) => ({
  redirect: { destination: url, permanent: false },
});

/**
 * There can be 3 cases:
 * - /editor?alertingAuthority=aa-id: create a new alert
 * - /editor?template=alert-id&alertingAuthority=aa-id: create a new alert, using the given alert as a template
 * - /editor/alert-id: edit the given alert
 *
 * When editing, the user must have edit permission for the AA of that alert, or the alert must have been shared with them.
 * When creating, we must know which AA the user wants to create the alert on, and they must have permission for this AA.
 */
export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return redirect("/login");

  // First, check if user wants to edit an alert through /editor/ID
  let { alertId } = context.query;

  let alert;
  let alertingAuthority;
  let isShared = false;
  // Next.js returns catch-all route params as array
  if (alertId) {
    alertId = alertId[0];
    alert = await prisma.alert.findFirst({
      where: { id: alertId },
      include: {
        SharedAlerts: {
          include: { User: { select: { email: true } } },
          where: { expires: { gt: new Date() } },
        },
        AlertingAuthority: {
          select: {
            name: true,
            countryCode: true,
            id: true,
          },
        },
      },
    });
    if (!alert) return redirect(`/error/${ERRORS.ALERT_NOT_FOUND.slug}`);

    alertingAuthority =
      session.user.alertingAuthorities?.[alert.alertingAuthorityId] ?? null;

    // The user must be part of this AA to edit it, or this alert must be shared with them
    isShared = !!alert.SharedAlerts.find(
      (s) => s.User.email === session.user.email
    );
    if (isShared) {
      alertingAuthority = alert.AlertingAuthority;
    } else if (!alertingAuthority) {
      return redirect(`/error/${ERRORS.AA_NOT_ALLOWED.slug}`);
    }

    // Nobody is allowed to edit an already-published alert
    if (alert.status === "PUBLISHED") {
      return redirect(`/error/${ERRORS.EDIT_PUBLISHED_ALERT.slug}`);
    }
  } else {
    // If they're not looking to edit an alert, they must be looking to create one.
    // So we need to know which AA they are creating the alert for
    // and that they have permission to create an alert for that AA.
    let alertingAuthorityId = context.query?.alertingAuthority;

    // If the AA hasn't been specified as ?alertingAuthority query param
    // but the user only has one AA, then by-default, choose this one
    if (typeof alertingAuthorityId !== "string") {
      const userAlertingAuthorities = Object.keys(
        session.user.alertingAuthorities
      );
      if (userAlertingAuthorities.length === 1) {
        alertingAuthorityId = userAlertingAuthorities[0];
      } else {
        return { props: {} };
      }
    }

    alertingAuthority = session.user.alertingAuthorities[
      alertingAuthorityId
    ] as AlertingAuthority;

    // The user must be part of this AA to be able to create one for it
    if (!alertingAuthority) {
      return redirect(`/error/${ERRORS.AA_NOT_ALLOWED.slug}`);
    }

    // Validators are not allowed to create new alerts -- they can only edit
    if (
      !alertingAuthority.roles.includes("ADMIN") &&
      !alertingAuthority.roles.includes("EDITOR")
    ) {
      return redirect(`/error/${ERRORS.NOT_ALLOWED_CREATE_ALERTS.slug}`);
    }
  }

  // Check if user wants to use an existing alert as a template through /editor?template=ID
  let isTemplate = false;
  if (!alertId) {
    alertId = context.query?.template;
    if (typeof alertId === "string") {
      isTemplate = true;
      alert = await prisma.alert.findFirst({ where: { id: alertId } });
      if (!alert) return redirect(`/error/${ERRORS.ALERT_NOT_FOUND.slug}`);
    }
  }

  let defaultAlertData: any;
  let editingAlert: any = null;
  if (alert) {
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
      defaultAlertData,
      editingAlert,
      alertingAuthority,
      session,
      isShared,
    },
  };
};

export default function EditorPage(props: Props) {
  const toaster = useToasterI18n();
  const router = useRouter();
  const { data: session } = useSession();
  const [alertingAuthorityId] = useAlertingAuthorityLocalStorage();

  // If ?template query param exists, hide it from user
  useMountEffect(() => {
    if (router.query.template || router.query.alertingAuthority) {
      router.replace("/editor", undefined, { shallow: true });
    }
  });

  if (!session) {
    return (
      <>
        <Head>
          <title>CAP Editor - Edit</title>
        </Head>
        <main>
          <Message type="info" header="Login">
            <Trans>Please login</Trans>.
          </Message>
        </main>
      </>
    );
  }

  if (!props.isShared && (!alertingAuthorityId || !props.defaultAlertData)) {
    return (
      <>
        <Head>
          <title>CAP Editor - Edit</title>
        </Head>
        <main>
          <Message type="info" header="Choose Alerting Authority">
            <Trans>
              Please choose which Alerting Authority you wish to create an alert
              for:
            </Trans>
            <br />
            <AlertingAuthoritySelector
              alertingAuthorities={session!.user.alertingAuthorities}
              appendToQuery
              fullWidth
            />
          </Message>
        </main>
      </>
    );
  }

  // Dates were serialised on server; convert back to Date now
  const defaultAlertData: FormAlertData = {
    ...props.defaultAlertData,
    from: new Date(props.defaultAlertData!.from),
    to: new Date(props.defaultAlertData!.to),
    timezone:
      session!.user.alertingAuthorities[alertingAuthorityId].defaultTimezone,
  };

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
          roles={props.isShared ? ["EDITOR"] : props.alertingAuthority!.roles}
          defaultAlertData={defaultAlertData}
          {...(props.editingAlert && {
            existingAlertStatus: props.editingAlert.status,
          })}
          isShareable={!props.isShared}
          onShareAlert={async (email) => {
            if (!props.editingAlert!.id) return;

            fetch(`/api/alerts/${props.editingAlert!.id}/share`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.error) throw new HandledError(res.message);
                toaster.push(
                  <Message type="success" duration={0} showIcon closable>
                    <Trans>
                      An invitation email to collaborate on this Alert has been
                      sent.
                    </Trans>
                  </Message>
                );
              })
              .catch((err) =>
                toaster.push(
                  <ErrorMessage error={err} action={t`sharing the alert`} />,
                  { placement: "bottomCenter" }
                )
              );
          }}
          onSubmit={async (
            alertData: FormAlertData,
            alertStatus: AlertStatus
          ) => {
            fetch(
              props.editingAlert
                ? `/api/alerts/${props.editingAlert.id}`
                : `/api/alerts/alertingAuthorities/${alertingAuthorityId}`,
              {
                method: props.editingAlert ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                  { status: alertStatus, data: alertData },
                  function (k, v) {
                    return this[k] instanceof Date
                      ? formatDate(this[k], alertData.timezone)
                      : v;
                  }
                ),
              }
            )
              .then((res) => res.json())
              .then((res) => {
                if (res.error) throw new HandledError(res.message);
                toaster.push(
                  <Message type="success" duration={0} showIcon closable>
                    <Trans>Alert successfully submitted.</Trans>
                  </Message>,
                  { placement: "bottomCenter" }
                );
                router.push("/");
              })
              .catch((err) =>
                toaster.push(
                  <ErrorMessage error={err} action={t`submitting the alert`} />,
                  { placement: "bottomCenter" }
                )
              );
          }}
          onCancel={() => {
            router.push("/");
          }}
        />
      </main>
    </>
  );
}
