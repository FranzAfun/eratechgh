/**
 * Plain-text and HTML alternatives for a Project Desk request (BRIEF.md → Emails).
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
import {
  EMAIL_COLOURS,
  calloutRow,
  emailDocument,
  escapeHtml,
  fieldRow,
  followUsLine,
  paragraph,
  referenceChip,
  replyButton,
  sectionRow,
} from "./email-html.js";

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

/** Sender display name on both emails: "ERA Tech · Project Desk". */
export const SENDER_NAME = site.siteTitle;
/** Formal sign-off on both emails: "— ERA Technologies, Project Desk". */
export const SIGN_OFF = `— ${site.legalName}, ${site.productName}`;

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
  const first = firstName(data.fullName);
  const rows = [fieldRow("Price shown", price)];

  const lines = [
    "New Project Desk request",
    "",
    `Reference: ${reference}`,
    `Service: ${service.name}`,
    `Price shown: ${price}`,
  ];
  if (data.service === "consultation" && data.discountRequested) {
    lines.push("70 % requested — check eligibility");
    rows.push(calloutRow("Discount requested: 70 % → GH₵75 — check eligibility"));
  }
  lines.push("", `— ${service.name} —`);
  rows.push(sectionRow(service.name));
  for (const f of SERVICE_FIELDS[data.service]) {
    if (f === "discountRequested") continue;
    lines.push(fieldLine(f, data[f]));
    rows.push(fieldRow(label(f), displayValue(f, data[f]), f));
  }
  lines.push("", "— Visitor details —");
  rows.push(sectionRow("Visitor details"));
  for (const f of DETAIL_FIELDS) {
    lines.push(fieldLine(f, data[f]));
    rows.push(fieldRow(label(f), displayValue(f, data[f]), f));
  }
  rows.push(
    fieldRow("ERA Store", data.storeOptIn ? "Yes — tell them when it opens" : "No"),
    fieldRow("Consent", data.consent ? "yes" : "no"),
    fieldRow("Sent", formatGmt(sentAt)),
  );
  lines.push(
    "",
    `ERA Store: ${data.storeOptIn ? "Yes — tell them when it opens" : "No"}`,
    // Only consented requests reach this point (shared rules require consent: true).
    `Consent: ${data.consent ? "yes" : "no"}`,
    `Sent: ${formatGmt(sentAt)}`,
    "",
    "Reply to this email to answer the visitor directly.",
    "",
    followUsLine(),
    "",
    SIGN_OFF,
  );

  const team = {
    from: { name: SENDER_NAME, address: headerSafe(mailFrom) },
    to: headerSafe(teamInbox),
    replyTo: { name, address: email },
    subject: headerSafe(`[Project Desk] ${service.shortName} — ${name} — ${reference}`),
    text: lines.join("\n"),
    html: emailDocument({
      preheader: `${service.name} request from ${first}`,
      heading: "New Project Desk request",
      headerDetails: `<p style="margin:16px 0;font-size:16px;line-height:24px;color:${EMAIL_COLOURS.white};">${escapeHtml(service.name)}</p>${referenceChip(reference)}`,
      content: `<table aria-label="Request details" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;margin:0 0 24px;">${rows.join("")}</table>${paragraph("Reply to this email to answer the visitor directly.")}${replyButton(data.email, reference, `Reply to ${first}`)}`,
      signOff: SIGN_OFF,
      audience: "team",
      year: sentAt.getUTCFullYear(),
    }),
  };

  const visitor = {
    from: { name: SENDER_NAME, address: headerSafe(mailFrom) },
    to: email,
    replyTo: headerSafe(teamInbox),
    subject: headerSafe(`We got your request — ERA Tech (${reference})`),
    text: [
      `Hi ${firstName(data.fullName)},`,
      "",
      `Thanks — we received your ${service.name.toLowerCase()} request. Your reference is ${reference}.`,
      "",
      `What happens next: ${NEXT_STEP[data.service]}`,
      "",
      "Reply to this email to add details or photos.",
      "",
      followUsLine(),
      "",
      SIGN_OFF,
    ].join("\n"),
    html: emailDocument({
      preheader: `Your reference is ${reference}`,
      heading: "We got your request",
      headerDetails: `<p style="margin:16px 0 0;">${referenceChip(reference)}</p>`,
      content: `${paragraph(`Hi ${first},`)}${paragraph(`Thanks — we received your ${service.name.toLowerCase()} request.`)}${paragraph(`What happens next: ${NEXT_STEP[data.service]}`)}${paragraph("Reply to this email to add details or photos.")}${replyButton(teamInbox, reference, "Reply to the team")}`,
      signOff: SIGN_OFF,
      audience: "visitor",
      year: sentAt.getUTCFullYear(),
    }),
  };

  return { team, visitor };
}
