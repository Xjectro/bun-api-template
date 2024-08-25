import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../../../constants";

const transporter: Transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const mailOptions = {
    from: config.email.user,
    to,
    subject,
    html: `<!DOCTYPE html><html><head><title>Email</title></head>${html}<body></body>`,
  };

  await transporter.sendMail(mailOptions).catch(() => {});
  console.log(`Email sent to ${to}`);
}
