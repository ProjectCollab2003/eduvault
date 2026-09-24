import nodemailer from "nodemailer";

const requiredMailSettings = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD"];

const getTransporter = () => {
  const missing = requiredMailSettings.filter((setting) => !process.env[setting]);
  if (missing.length) {
    const error = new Error(`Email service is not configured. Missing: ${missing.join(", ")}`);
    error.statusCode = 500;
    throw error;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const emailService = {
  async sendVerificationEmail({ name, email, token }) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    if (process.env.EMAIL_DELIVERY_MODE === "console") {
      console.log(`Verification link for ${email}: ${verificationUrl}`);
      return;
    }

    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Verify your EduVault account",
      text: `Hi ${name},\n\nPlease verify your EduVault account by opening this link:\n${verificationUrl}\n\nThis link expires in 24 hours.`,
      html: `<p>Hi ${name},</p><p>Please verify your EduVault account by clicking the link below:</p><p><a href="${verificationUrl}">Verify my email address</a></p><p>This link expires in 24 hours.</p>`,
    });
  },
};