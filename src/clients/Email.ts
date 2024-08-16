import nodemailer, { Transporter } from "nodemailer";
import { config } from "../constants";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailClient {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  private generateHtmlTemplate(htmlContent: string): string {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email</title>
            </head>
            <body>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    section {
                        padding: 20px;
                        margin: 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        max-width: 400px;
                        background-color: #fafafa;
                        border: 2px solid #ebebeb;
                        border-radius: 8px;
                    }
                    h3 {
                        font-size: 24px;
                    }
                    p {
                        font-size: 18px;
                    }
                    strong {
                        color: #75A1D0;
                    }
                    strong:hover {
                        color: #5382b4;
                    }
                </style>
                ${htmlContent}
            </body>
            </html>
        `;
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to,
      subject,
      html: this.generateHtmlTemplate(html),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
