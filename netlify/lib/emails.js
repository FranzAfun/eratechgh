/**
 * Plain-text emails for a Project Desk request (BRIEF.md → Emails).
 * The visitor's confirmation never repeats their own text: only their first name and the service.
 */
import { site } from "../../src/content/site.js";
import {
  PREFERRED_TIMES,
  PROJECT_AREAS,
  SERVICE_FIELDS,
  DETAIL_FIELDS,
  priceLine,
} from "../../src/lib/request-rules.js";

/** Removes CR/LF (and other control characters) from anything that goes into a header. */
export function headerSafe(value) {
  return (
    String(value ?? "")
      // eslint-disable-next-line no-control-regex -- stripping control characters is the point
      .replace(/[\r\n\u0000-\u001f\u007f]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function serviceInfo(slug) {
  return site.services.find((s) => s.slug === slug);
}

/** First word of the name, letters only (the name rules already forbid anything else). */
export function firstName(fullName) {
  const first = headerSafe(fullName).split(" ")[0] ?? "";
  return first.slice(0, 40);
}

/** "9 Nov 2026, 14:05 GMT" */
export function formatGmt(date) {
  const d = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const t = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return `${d}, ${t} GMT`;
}

const label = (name) => site.request.labels[name];

function displayValue(name, value) {
  if (name === "projectArea") return PROJECT_AREAS.find((a) => a.value === value)?.label ?? "—";
  if (name === "preferredTime") return PREFERRED_TIMES.find((t) => t.value === value)?.label ?? "—";
  if (name === "discountRequested") return value ? "Yes" : "No";
  if (value === "" || value == null) return "—";
  return String(value);
}

/** Multi-line answers go under their label; short ones sit beside it. */
function fieldLine(name, value) {
  const text = displayValue(name, value);
  const title = name === "discountRequested" ? "70 % discount requested" : label(name);
  return text.includes("\n") || text.length > 60 ? `${title}:\n${text}\n` : `${title}: ${text}`;
}

const NEXT_STEP = {
  sourcing:
    "We'll send you an itemised quote. You pay for the parts and delivery only after you approve it.",
  assessment:
    "We'll send you the GH₵50 payment details first, then ask for your full project abstract.",
  consultation: "We'll confirm a time and payment with you. Nothing is booked yet.",
};

/**
 * Builds both emails. data = cleaned values from validateRequest.
 * Returns { team, visitor } as nodemailer message objects (minus `from` defaults).
 */
export function buildEmails({ data, reference, sentAt, mailFrom, teamInbox }) {
  const service = serviceInfo(data.service);
  const name = headerSafe(data.fullName);
  const email = headerSafe(data.email);
  const price = priceLine(data.service, data.discountRequested);

  const lines = [
    "New Project Desk request",
    "",
    `Reference: ${reference}`,
    `Service: ${service.name}`,
    `Price shown: ${price}`,
  ];
  if (data.service === "consultation" && data.discountRequested) {
    lines.push("70 % requested — check eligibility");
  }
  lines.push("", `— ${service.name} —`);
  for (const f of SERVICE_FIELDS[data.service]) {
    if (f === "discountRequested") continue;
    lines.push(fieldLine(f, data[f]));
  }
  lines.push("", "— Your details —");
  for (const f of DETAIL_FIELDS) lines.push(fieldLine(f, data[f]));
  lines.push(
    "",
    `ERA Store: ${data.storeOptIn ? "Yes — tell them when it opens" : "No"}`,
    `Sent: ${formatGmt(sentAt)}`,
    "",
    "Reply to this email to answer the visitor directly.",
  );

  const team = {
    from: { name: "ERA Tech Project Desk", address: headerSafe(mailFrom) },
    to: headerSafe(teamInbox),
    replyTo: { name, address: email },
    subject: headerSafe(`[Project Desk] ${service.shortName} — ${name} — ${reference}`),
    text: lines.join("\n"),
  };

  const visitor = {
    from: { name: "ERA Tech", address: headerSafe(mailFrom) },
    to: email,
    replyTo: headerSafe(teamInbox),
    subject: `We got your request — ERA Tech (${reference})`,
    text: [
      `Hi ${firstName(data.fullName)},`,
      "",
      `Thanks — we received your ${service.name.toLowerCase()} request. Your reference is ${reference}.`,
      "",
      `What happens next: ${NEXT_STEP[data.service]}`,
      "",
      "Reply to this email to add details or photos.",
      "",
      "— ERA Tech team",
    ].join("\n"),
  };

  return { team, visitor };
}
