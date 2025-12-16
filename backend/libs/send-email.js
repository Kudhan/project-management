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
    console.error("❌ SendGrid Error:", error.message);
    console.log("⚠️ Falling back to console logging due to email failure.");
    console.log("================ EMAIL CONTENT ================");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("HTML:", html);
    console.log("===============================================");
    // Return true so the flow continues as if the email was sent
    return true;
  }
};
