import { createTransport } from "nodemailer";

const transport = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async ({
  to, from, subject, text, html,
} = {}) => {
  return await transport.sendMail({ to, from, subject, text, html });
};
