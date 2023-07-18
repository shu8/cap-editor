# Registering

Please perform the following steps to register an account with the platform:

1. Use the "Register with your Alerting Authority" button to register on the platform
2. Provide your name and email address in the form
3. Login via the same email address
4. Check your email and click the unique temporary login link to login to the platform

# Logging in with biometrics

After initial registration and logging in via the emailed link, you can setup your device to login with biometrics in future (e.g., fingerprint, face recognition, etc.). This will enable you to login without needing to enter a username or password in future.

!> Setting up biometric login must be done **per-device**.

To set up biometric login, you must have a supported device (e.g., one that has Windows Hello, Apple Face ID, Apple Touch ID, etc.), and then perform the following steps:

1. After logging in once, visit the 'Settings' page
2. Click the "Register WebAuthn" button in the 'Security' section
3. Follow your browser's prompts to authenticate yourself using biometrics

Once biometric login has been set up successfully, when you next visit the login screen on this device, you will be automatically prompted to use biometrics.

?> If you have not set up biometrics on a given device, you may still be prompted to use biometrics when you visit the login page. You may dismiss this and enter your email address to login normally.

# Connecting to an Alerting Authority

Before you can use the platform to draft and/or publish alerts, you must connect to an _Alerting Authority_ (AA). You will already know which AA(s) you are a part of. To connect to an AA, please perform the following steps:

1. After logging in, visit the 'Settings' page
2. Find your AA in the dropdown menu in the 'Connect to Alerting Authorities' section
3. Submit the form using the 'Connect to Alerting Authority' button

On submission, a request to the author of your chosen AA will be sent via email. They will need to approve your affiliation with the AA before you can use the platform with this AA. You are automatically sent an email when your affiliation is approved (or rejected).

?> You may connect to multiple AAs, however each affiliation will have to go through the approval process with the respective AA author.

There may be cases where your AA is not listed in the dropdown menu. In this case, please choose the 'Other' option. This will send an approval email to the IFRC, who will verify you are part of this AA.

# Access rights

When you connect to an AA, its author must approve your account. They will also assign the access rights you have, of which there are up to 3 possible:

- Editor: edit any non-published alert, and create draft/template alerts
- Validator: edit any existing draft alert, and publish any valid existing draft alert
- Administrator: edit any non-published alert, create draft/template alerts, and publish any valid alert

In practice, this only affects what you see in the Editor interface -- for example, if you are assigned as an _editor_, then you will not see a button to 'publish' alerts.

# Handling multiple Alerting Authorities

If you are part of multiple AAs, you will need to select which AA you would like to view when using the platform. This is because each AA has different alerts, and you may have been assigned different access rights for each AA.

To choose which AA to view, use the dropdown menu at the top-right of every page. This shows all AAs that you have connected to and which have been approved. This will change what alerts you see on the Dashboard.

# The Dashboard

The main homepage after logging in presents the _dashboard_. This shows all currently active published alerts, draft alerts, template alerts, and expired published alerts.

Every alert has a corresponding image summarising the core information, which can be shared on e.g., social media to help disseminate alert information.

All active published alerts can also be shared directly on social media using the respective buttons underneath the alert.

Any alert can be used as a basis for a new alert by using the 'Use as template for new alert' button.

?> The 'raw' alert (XML) can be found by clicking on the 'View alert' button next to an alert. In most cases, you will not need to use this.

# Creating or editing alerts

To create an alert, click the 'Create alert' button at the top-right of any page.

To edit an alert, click the 'Edit alert' button next to the relevant alert in the Dashboard.

To create an alert based on an existing alert, click the 'Use as template for new alert' button next to the relevant alert in the Dashboard.

The interface for all three of these options is the same. Editing alerts is split into 6 steps:

1. Metadata: the status, message type, references of the alert (if message type is Public or Cancel)
2. Category: what type(s) of alert this is
3. Map: the exact regions affected by the alert
4. Data: the start/end time, severity/certainty/urgency of the alert, and the recommended actions (if any) to be taken
5. Text: the title, headline, description, instruction of the alert, and any links to external resources
6. Summary: a summary of the information provided in the previous steps

Each step must be completed fully before moving to the next step, to promote high consistency and quality of alerts.

?> The 'text' for alerts can be added in multiple languages, using the 'Add Another Language?' button at the top of the editor. All fields must be provided in full for any language added, and at least one language must be provided (the default is English).

# Viewing the interface in a different language

The IFRC aims to support all four of its working languages for the platform's interface: English, French, Spanish, Arabic.

These translations are being added over time. To show the interface in a different language, use the 'Language' dropdown menu at the bottom of every page to choose your desired language. This will immediately update the language of the interface for your current session.
