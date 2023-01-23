import { t } from "@lingui/macro";

export const ERRORS = {
  ACCOUNT_NOT_VERIFIED_YET: {
    slug: "not-verified",
    message: t`Your account has not yet been verified by your Alerting Authority.`,
  },
  INVALID_VERIFICATION_TOKEN: {
    slug: "invalid-verification-token",
    message: t`Your verification link is invalid or expired.`,
  },
  NOT_ALLOWED_CREATE_ALERTS: {
    slug: "alert-creation-denied",
    message: t`Your account does not have permission to create new alerts; you may edit an alert from the homepage.`,
  },
  ALERT_NOT_FOUND: {
    slug: "alert-not-found",
    message: t`The requested alert could not be found.`,
  },
  EDIT_PUBLISHED_ALERT: {
    slug: "edit-published-alert",
    message: t`You cannot edit a published alert. Please create a new alert referencing the existing one if you need to update information.`,
  },
};
