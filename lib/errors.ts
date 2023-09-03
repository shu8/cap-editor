import { msg } from "@lingui/macro";

export const ERRORS = {
  ACCOUNT_NOT_VERIFIED_YET: {
    slug: "not-verified",
    message: msg`Your account has not yet been verified by your Alerting Authority.`,
  },
  INVALID_VERIFICATION_TOKEN: {
    slug: "invalid-verification-token",
    message: msg`Your verification link is invalid or expired.`,
  },
  AA_NOT_ALLOWED: {
    slug: "alerting-authority-forbidden",
    message: msg`Your account does not have permission to edit alerts for this Alerting Authority. You may request to connect to this Alerting Authority via your Settings page if you are a member of it.`,
  },
  NOT_ALLOWED_CREATE_ALERTS: {
    slug: "alert-creation-denied",
    message: msg`Your account does not have permission to create new alerts for this Alerting Authority; you may edit an alert from the homepage, or request your Alerting Authority administrator to grant you permission to create new alerts.`,
  },
  ALERT_NOT_FOUND: {
    slug: "alert-not-found",
    message: msg`The requested alert could not be found.`,
  },
  EDIT_PUBLISHED_ALERT: {
    slug: "edit-published-alert",
    message: msg`You cannot edit a published alert. Please create a new alert referencing the existing one if you need to update information.`,
  },
};
