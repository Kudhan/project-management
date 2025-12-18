import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendEmail = async (to, subject, html) => {
  const fromEmail = process.env.FROM_EMAIL || "no-reply@example.com";
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { name: "CollabSphere", email: fromEmail };
  sendSmtpEmail.to = [{ email: to }];

  try {
    console.log(`📨 Attempting to send email to ${to} via Brevo API...`);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully. MessageId:", data.messageId);
    return true;
  } catch (error) {
    console.error("❌ Brevo API Error:", error);
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
