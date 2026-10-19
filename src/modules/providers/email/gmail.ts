import "server-only";
import nodemailer from "nodemailer";
import type { CodeDelivery } from "@/modules/auth/contracts";

export function gmailDelivery(): CodeDelivery {
  const user = process.env.GMAIL_USER;
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_OAUTH_REFRESH_TOKEN;
  if (!user || !clientId || !clientSecret || !refreshToken) {
    throw new Error("Email delivery is not configured. Add the GMAIL OAuth values in Secrets.");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { type: "OAuth2", user, clientId, clientSecret, refreshToken },
  });
  return {
    async sendCode(email, code) {
      try {
        await transporter.sendMail({
          from: { name: "DiscoveryDojo", address: user }, to: email,
          subject: "Your DiscoveryDojo sign-in code",
          text: `Your sign-in code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
        });
      } catch {
        throw new Error("Email could not be delivered. Check Gmail OAuth configuration, then request a new code after 60 seconds.");
      }
    },
  };
}
