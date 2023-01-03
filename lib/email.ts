import { readFileSync } from "fs";
import { createTransport } from "nodemailer";

const transport = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const createHTML = ({
  title,
  url,
  urlText,
  body,
}: {
  title: string;
  url: string;
  urlText: string;
  body: string;
}) => {
  let template = readFileSync("./email-template.html", "utf-8");
  template = template
    .replace("$TITLE", title)
    .replace("$BODY", body)
    .replace("$LINK", url)
    .replace("$LINK_TEXT", urlText);
  return template;
};

export const sendEmail = async ({
  to,
  from = process.env.EMAIL_FROM,
  subject,
  title,
  url,
  urlText,
  body,
}: {
  to: string,
  from?: string;
  subject: string;
  title: string;
  url: string;
  urlText: string;
  body: string;
}) => {
  return transport.sendMail({
    to,
    from,
    subject,
    text: `${body}.\n\n${url}`,
    html: createHTML({ title, url, urlText, body }),
  });
};
