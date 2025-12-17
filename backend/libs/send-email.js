import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  const fromEmail = process.env.FROM_EMAIL || "no-reply@example.com";

  try {
    console.log(`📨 Attempting to send email to ${to} via Brevo SMTP...`);

    const info = await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully. MessageId:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ SMTP Error:", error.message);
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
