export const ERRORS = {
  ACCOUNT_NOT_VERIFIED_YET: {
    slug: 'not-verified',
    message: 'Your account has not yet been verified by your Alerting Authority.',
  },
  INVALID_VERIFICATION_TOKEN: {
    slug: 'invalid-verification-token',
    message: 'Your verification link is invalid or expired.'
  },
  NOT_ALLOWED_CREATE_ALERTS: {
    slug: 'alert-creation-denied',
    message: 'Your account does not have permission to create new alerts; you may edit an alert from the homepage.'
  },
  ALERT_NOT_FOUND: {
    slug: 'alert-not-found',
    message: 'The requested alert could not be found.'
  }
};
