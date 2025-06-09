import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const fromEmail = process.env.FROM_EMAIL;

if (!process.env.SENDGRID_API_KEY || !fromEmail) {
  throw new Error("Missing SendGrid API key or sender email in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: fromEmail,
      subject,
      html
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully to", to);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    if (error.response) {
      console.error("SendGrid response:", error.response.body);
    }
    throw new Error("Failed to send email");
  }
};
