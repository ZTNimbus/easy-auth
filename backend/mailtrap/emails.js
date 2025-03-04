import { sender, mailer } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
export async function sendVerificationEmail(email, verificationToken) {
  const recipients = [email];

  try {
    const response = await mailer.sendMail({
      from: sender,
      to: recipients,
      subject: "Verify Your Email | Easy Auth",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email.");
  }
}

export async function sendWelcomeEmail(email, name) {
  const recipients = [email];

  try {
    const response = await mailer.sendMail({
      from: sender,
      to: recipients,
      subject: "Welcome to Our App",
      templateUuid: "51e7ccb2-863b-419f-8de8-9fb1470c7500",
      templateVariables: {
        company_info_name: "Easy Auth",
        name,
      },
      category: "Welcome Email",
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send welcome email.");
  }
}
