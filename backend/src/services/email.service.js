import { env } from "../config/env.js";

/**
 * Sends password reset email when SMTP is configured; otherwise logs in development only.
 * @param {{ to: string; resetUrl: string; name?: string }} params
 */
export async function sendPasswordResetEmail({ to, resetUrl, name }) {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: "Reset your CareerVerse password",
      text: `Hi${name ? ` ${name}` : ""},\n\nReset your password:\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
      html: `<p>Hi${name ? ` ${escapeHtml(name)}` : ""},</p><p><a href="${escapeHtml(resetUrl)}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });
    return;
  }

  if (env.NODE_ENV === "development") {
    console.info(`[email:dev] Password reset for ${to}: ${resetUrl}`);
  } else {
    console.warn("[email] SMTP not configured; password reset email was not sent.");
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
