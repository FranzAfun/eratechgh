import { describe, expect, it } from "vitest";
import { buildEmails, firstName, formatGmt, headerSafe } from "../lib/emails.js";
import { EMAIL_COLOURS, escapeHtml, replyHref } from "../lib/email-html.js";
import { DETAIL_FIELDS, SERVICE_FIELDS, validateField } from "../../src/lib/request-rules.js";
import { site } from "../../src/content/site.js";
import { readFileSync } from "node:fs";
import nodemailer from "nodemailer";

const base = {
  fullName: "Sample Placeholder",
  email: "sample.placeholder@example.com",
  phone: "+233 20 123 4567",
  town: "Ho",
  storeOptIn: true,
  consent: true,
};
const consultation = {
  service: "consultation",
  projectTitle: "Smart irrigation",
  abstract: "Line one of the abstract.\nLine two of the abstract.",
  guidance: "Choosing sensors",
  preferredDate: "2026-11-20",
  preferredTime: "afternoon",
  discountRequested: true,
  ...base,
};
const build = (data, overrides = {}) =>
  buildEmails({
    data,
    reference: "PD-7K3QX2",
    sentAt: new Date("2026-11-09T14:05:00Z"),
    mailFrom: "no-reply@example.com",
    teamInbox: "team@example.com",
    ...overrides,
  });

describe("emails", () => {
  it("team email: subject, reply-to and every field", () => {
    const { team } = build(consultation);
    expect(team.subject).toBe("[Project Desk] Consultation — Sample Placeholder — PD-7K3QX2");
    expect(team.to).toBe("team@example.com");
    expect(team.replyTo).toEqual({
      name: "Sample Placeholder",
      address: "sample.placeholder@example.com",
    });
    expect(team.from).toEqual({ name: "ERA Tech · Project Desk", address: "no-reply@example.com" });
    expect(team.text.trim().endsWith("— ERA Technologies, Project Desk")).toBe(true);
    for (const s of [
      "Reference: PD-7K3QX2",
      "Service: Expert consultation",
      "Price shown: GH₵75 if eligible",
      "70 % requested — check eligibility",
      "Line two of the abstract.",
      "Preferred time: Afternoon (12–4)",
      "Phone / WhatsApp: +233 20 123 4567",
      "ERA Store: Yes",
      "Consent: yes",
      "Sent: 9 Nov 2026, 14:05 GMT",
    ]) {
      expect(team.text).toContain(s);
    }
  });

  it("visitor email: reply-to team, first name and service only", () => {
    const { visitor } = build(consultation);
    expect(visitor.subject).toBe("We got your request — ERA Tech (PD-7K3QX2)");
    expect(visitor.to).toBe("sample.placeholder@example.com");
    expect(visitor.replyTo).toBe("team@example.com");
    expect(visitor.from).toEqual({
      name: "ERA Tech · Project Desk",
      address: "no-reply@example.com",
    });
    expect(visitor.text.trim().endsWith("— ERA Technologies, Project Desk")).toBe(true);
    expect(visitor.text).toMatch(/^Hi Sample,/);
    expect(visitor.text).toContain("expert consultation request");
    expect(visitor.text).toContain("Nothing is booked yet");
    // Never repeats the visitor's own text.
    for (const own of [
      "Smart irrigation",
      "abstract",
      "Choosing sensors",
      "Placeholder",
      "Ho\n",
      "+233",
    ]) {
      expect(visitor.text).not.toContain(own);
    }
  });

  it("per-service next steps", () => {
    const s = build({ service: "sourcing", components: "x".repeat(20), neededBy: "", ...base });
    expect(s.visitor.text).toContain("itemised quote");
    expect(s.team.text).toContain("Price shown: Free quote");
    expect(s.team.text).not.toContain("70 %");
    const a = build({
      service: "assessment",
      projectTitle: "Solar",
      projectArea: "",
      description: "",
      ...base,
    });
    expect(a.visitor.text).toContain("GH₵50 payment details");
    expect(a.team.text).toContain("Project area: —");
  });

  it("strips CR/LF from header values", () => {
    expect(headerSafe("Sample\r\nBcc: evil@example.com")).toBe("Sample Bcc: evil@example.com");
    const { team } = build({ ...consultation, fullName: "Sample\r\nPlaceholder" });
    expect(team.subject).not.toMatch(/[\r\n]/);
    expect(team.replyTo.name).not.toMatch(/[\r\n]/);
  });

  it("helpers", () => {
    expect(firstName("  Test Maker-Person ")).toBe("Test");
    expect(formatGmt(new Date("2026-01-02T03:04:00Z"))).toBe("2 Jan 2026, 03:04 GMT");
  });
});

describe("HTML email alternatives", () => {
  it("preserves visitor text and changes only the team details heading", () => {
    const { team, visitor } = build(consultation);
    expect(team.text).toBe(`New Project Desk request

Reference: PD-7K3QX2
Service: Expert consultation
Price shown: GH₵75 if eligible
70 % requested — check eligibility

— Expert consultation —
Project title: Smart irrigation
Project abstract:
Line one of the abstract.
Line two of the abstract.

What guidance do you need most?: Choosing sensors
Preferred date: 2026-11-20
Preferred time: Afternoon (12–4)

— Visitor details —
Full name: Sample Placeholder
Email: sample.placeholder@example.com
Phone / WhatsApp: +233 20 123 4567
Town or city: Ho

ERA Store: Yes — tell them when it opens
Consent: yes
Sent: 9 Nov 2026, 14:05 GMT

Reply to this email to answer the visitor directly.

— ERA Technologies, Project Desk`);
    expect(visitor.text).toBe(`Hi Sample,

Thanks — we received your expert consultation request. Your reference is PD-7K3QX2.

What happens next: We'll confirm a time and payment with you. Nothing is booked yet.

Reply to this email to add details or photos.

— ERA Technologies, Project Desk`);
  });

  it.each([
    { service: "sourcing", components: "Sample parts\nSecond line", neededBy: "", ...base },
    {
      service: "assessment",
      projectTitle: "Sample project",
      projectArea: "iot",
      description: "",
      ...base,
    },
    consultation,
  ])("keeps all $service fields in text order and visitor details private", (data) => {
    const { team, visitor } = build(data);
    const labels = [...team.html.matchAll(/<th scope="row"[^>]*>(.*?)<\/th>/g)].map((m) => m[1]);
    let previous = -1;
    for (const label of labels) {
      const position = team.text.indexOf(`${label}:`);
      expect(position).toBeGreaterThan(previous);
      previous = position;
    }
    expect(labels).toEqual([
      "Price shown",
      ...[
        ...SERVICE_FIELDS[data.service].filter((f) => f !== "discountRequested"),
        ...DETAIL_FIELDS,
      ].map((f) => site.request.labels[f]),
      "ERA Store",
      "Consent",
      "Sent",
    ]);
    expect(visitor.html).not.toContain(data.email);
    expect(visitor.html).not.toContain(data.phone);
    expect(visitor.html).not.toContain("Placeholder");
    for (const field of ["components", "projectTitle", "abstract", "guidance"]) {
      if (data[field]) expect(visitor.html).not.toContain(data[field]);
    }
    expect(visitor.html).toContain("Reply to this email to add details or photos.");
    expect(visitor.html).toContain("— ERA Technologies, Project Desk");
    expect(team.html).toContain(">Visitor details</th>");
    expect(team.html).not.toContain(">Your details</th>");
    expect(team.text).toContain("— Visitor details —");
    expect(team.text).not.toContain("— Your details —");
  });

  it("shows the visitor reference chip only in the dark header, keeping the hidden preheader", () => {
    const { visitor } = build(consultation);
    const header = visitor.html.match(/<td bgcolor="#200940"[\s\S]*?<\/td>/)[0];
    expect(header).toContain(">PD-7K3QX2</span>");
    expect(visitor.html.match(/>PD-7K3QX2<\/span>/g)).toHaveLength(1);
    expect(visitor.html).toContain("Your reference is PD-7K3QX2</div>");
    expect(visitor.html).toContain("Thanks — we received your expert consultation request.</p>");
    expect(visitor.html).not.toContain("request. Your reference is");
  });

  it("shows the requested discount as a callout only when requested", () => {
    const { team } = build(consultation);
    const copy = "Discount requested: 70 % → GH₵75 — check eligibility";
    expect(team.html).toContain(
      `background-color:#F7F5F9;color:#3B1174;border-radius:6px;font-size:14px;line-height:24px;">${copy}</p>`,
    );
    expect(team.html.match(/Discount requested:/g)).toHaveLength(1);
    expect(team.text).toContain("70 % requested — check eligibility");
    expect(team.text).not.toContain(copy);
    const regular = build({ ...consultation, discountRequested: false });
    expect(regular.team.html).not.toContain("Discount requested:");
    expect(regular.team.html).toContain("GH₵250");
    expect(regular.team.text).not.toContain("70 % requested");
    for (const data of [
      { service: "sourcing", components: "Sample parts", neededBy: "", ...base },
      {
        service: "assessment",
        projectTitle: "Sample project",
        projectArea: "",
        description: "",
        ...base,
      },
    ]) {
      expect(build(data).team.html).not.toContain("Discount requested:");
    }
  });

  it("escapes hostile names, long text, reference chips and both preheaders", () => {
    const name = '<script>"&?Sample</script> Placeholder';
    const abstract = "<script>alert(\"sample\" & 'placeholder')</script>\nSecond line & details";
    const reference = 'PD-<script>"&?';
    const { team, visitor } = build({ ...consultation, fullName: name, abstract }, { reference });
    for (const message of [team, visitor]) {
      expect(message.html).not.toContain("<script>");
      expect(message.html).toContain("&lt;script&gt;&quot;&amp;?Sample&lt;/script&gt;");
      expect(message.html).toContain(escapeHtml(reference));
      expect(message.html).toContain('style="display:none;max-height:0');
      expect(message.html).not.toMatch(/<style|<script|<img|<link|@font-face/i);
      expect(message.html.match(/<h1\b/g)).toHaveLength(1);
    }
    expect(team.html).toContain(escapeHtml(abstract).replace("\n", "<br>"));
    expect(team.html).toContain(
      `Expert consultation request from ${escapeHtml(firstName(name))}</div>`,
    );
    expect(visitor.html).toContain(`Your reference is ${escapeHtml(reference)}</div>`);
    expect(visitor.html).not.toContain("Second line");
  });

  it("validates email before encoding address and subject, including &, ? and quotes", () => {
    const email = "sample&?'placeholder@example.com";
    const name = 'Sample&?" Placeholder';
    const reference = 'PD-7K3QX2&?"';
    expect(validateField("email", email)).toBeNull();
    const { team, visitor } = build({ ...consultation, email, fullName: name }, { reference });
    const target = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${reference}`)}`;
    expect(team.html).toContain(`href="${escapeHtml(target)}"`);
    expect(team.html).toContain("Reply to Sample&amp;?&quot;");
    expect(visitor.html).toContain(
      `href="${escapeHtml(replyHref("team@example.com", reference))}"`,
    );
    expect(team.html).toContain('href="tel:%2B233201234567"');

    const invalid = 'sample&?"placeholder@example.com';
    expect(validateField("email", invalid)).toBeTruthy();
    expect(replyHref(invalid, reference)).toBeNull();
    const rejected = build({ ...consultation, email: invalid, fullName: name });
    expect(rejected.team.html).toContain(escapeHtml(invalid));
    expect(rejected.team.html).not.toContain("mailto:");
    expect(replyHref("sample@example.com\r\nBcc:evil@example.com", reference)).toBeNull();
  });

  it("keeps every interpolated header CR/LF-safe", () => {
    const { team, visitor } = build(
      { ...consultation, fullName: "Sample\r\nPlaceholder", email: "sample@example.com\r\n" },
      {
        reference: "PD-7K3QX2\r\nBcc: sample@example.com",
        mailFrom: "from@example.com\r\n",
        teamInbox: "team@example.com\r\n",
      },
    );
    for (const message of [team, visitor]) {
      for (const value of [message.subject, message.to, message.from.address])
        expect(value).not.toMatch(/[\r\n]/);
      for (const value of Object.values(
        typeof message.replyTo === "string" ? { address: message.replyTo } : message.replyTo,
      ))
        expect(value).not.toMatch(/[\r\n]/);
    }
  });

  it("uses only token colours and a single reply button per valid email", () => {
    const tokens = readFileSync(
      new URL("../../src/styles/tokens.css", import.meta.url),
      "utf8",
    ).toLowerCase();
    for (const colour of Object.values(EMAIL_COLOURS))
      expect(tokens).toContain(colour.toLowerCase());
    const { team, visitor } = build(consultation);
    for (const message of [team, visitor]) {
      expect(message.html).toContain("max-width:600px");
      const buttons = [...message.html.matchAll(/<a [^>]*>Reply to [^<]*<\/a>/g)];
      expect(buttons).toHaveLength(1);
      for (const colour of message.html.match(/#[0-9a-f]{6}/gi))
        expect(Object.values(EMAIL_COLOURS)).toContain(colour);
    }
  });

  it("nodemailer emits multipart/alternative with plain text and HTML without sending", async () => {
    const transport = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
      newline: "unix",
    });
    for (const message of Object.values(build(consultation))) {
      const result = await transport.sendMail(message);
      const mime = result.message.toString();
      expect(mime).toContain("Content-Type: multipart/alternative;");
      expect(mime).toContain("Content-Type: text/plain; charset=utf-8");
      expect(mime).toContain("Content-Type: text/html; charset=utf-8");
    }
  });
});
