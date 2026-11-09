/** Fictional local previews only. Never reads environment variables or sends mail. */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { buildEmails } from "../netlify/lib/emails.js";
import { validateRequest } from "../src/lib/request-rules.js";

const { ok, data } = validateRequest(
  {
    service: "consultation",
    fullName: "Sample Placeholder",
    email: "sample.placeholder@example.com",
    phone: "+233 00 000 0000",
    town: "Sample town",
    projectTitle: "Sample sensor project",
    abstract:
      "A fictional project to measure soil moisture and show the reading.\nA second line explains the sample prototype and its next step.",
    guidance: "Help choosing a sensor and reviewing the sample circuit.",
    preferredDate: "2026-11-20",
    preferredTime: "afternoon",
    discountRequested: true,
    storeOptIn: true,
    consent: true,
  },
  { today: "2026-11-09" },
);
if (!ok) throw new Error("Preview fixture failed shared validation");

const emails = buildEmails({
  data,
  reference: "PD-7K3QX2",
  sentAt: new Date("2026-11-09T14:05:00Z"),
  mailFrom: "no-reply@eratechgh.com",
  teamInbox: "projects@eratechgh.com",
});
const directory = new URL("../.email-previews/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const [role, message] of Object.entries(emails)) {
  const file = new URL(`${role}.html`, directory);
  await writeFile(file, message.html);
  console.log(`Email preview: ${fileURLToPath(file)}`);
}
