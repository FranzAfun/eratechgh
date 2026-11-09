/** Fictional local previews only. Never reads environment variables or sends mail. */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildEmails } from "../netlify/lib/emails.js";
import { validateRequest } from "../src/lib/request-rules.js";

export function buildPreviewEmails() {
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

  return buildEmails({
    data,
    reference: "PD-7K3QX2",
    sentAt: new Date("2026-11-09T14:05:00Z"),
    mailFrom: "no-reply@eratechgh.com",
    teamInbox: "projects@eratechgh.com",
  });
}

/** Rewrite image sources only after composing the real messages. Sending never uses local paths. */
export function localPreviewHtml(html) {
  return html.replace(
    /(<img\b[^>]*\bsrc=")https:\/\/eratechgh\.com\/email\/([^"/]+)(")/g,
    "$1../public/email/$2$3",
  );
}

export async function writeEmailPreviews() {
  const directory = new URL("../.email-previews/", import.meta.url);
  await mkdir(directory, { recursive: true });
  for (const [role, message] of Object.entries(buildPreviewEmails())) {
    const file = new URL(`${role}.html`, directory);
    await writeFile(file, localPreviewHtml(message.html));
    console.log(`Email preview: ${fileURLToPath(file)}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await writeEmailPreviews();
}
