import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { createHandler } from "../lib/handler.js";

let transport;
function createTransport(env) {
  if (!transport) {
    const port = Number(env.SMTP_PORT);
    transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = TLS from the start; 587 = STARTTLS
      requireTLS: port !== 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transport;
}

export default createHandler({ env: process.env, createTransport, randomBytes });

export const config = {
  path: "/api/request",
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
