import { describe, expect, it } from "vitest";
import { buildEmails, firstName, formatGmt, headerSafe } from "../lib/emails.js";

const base = {
  fullName: "Ama Mensah",
  email: "ama.mensah@example.com",
  phone: "+233 20 123 4567",
  town: "Ho",
  storeOptIn: true,
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
const build = (data) =>
  buildEmails({
    data,
    reference: "PD-7K3QX2",
    sentAt: new Date("2026-11-09T14:05:00Z"),
    mailFrom: "no-reply@example.com",
    teamInbox: "team@example.com",
  });

describe("emails", () => {
  it("team email: subject, reply-to and every field", () => {
    const { team } = build(consultation);
    expect(team.subject).toBe("[Project Desk] Consultation — Ama Mensah — PD-7K3QX2");
    expect(team.to).toBe("team@example.com");
    expect(team.replyTo).toEqual({ name: "Ama Mensah", address: "ama.mensah@example.com" });
    expect(team.from).toEqual({ name: "ERA Tech Project Desk", address: "no-reply@example.com" });
    for (const s of [
      "Reference: PD-7K3QX2",
      "Service: Expert consultation",
      "Price shown: GH₵75 if eligible",
      "70 % requested — check eligibility",
      "Line two of the abstract.",
      "Preferred time: Afternoon (12–4)",
      "Phone / WhatsApp: +233 20 123 4567",
      "ERA Store: Yes",
      "Sent: 9 Nov 2026, 14:05 GMT",
    ]) {
      expect(team.text).toContain(s);
    }
  });

  it("visitor email: reply-to team, first name and service only", () => {
    const { visitor } = build(consultation);
    expect(visitor.subject).toBe("We got your request — ERA Tech (PD-7K3QX2)");
    expect(visitor.to).toBe("ama.mensah@example.com");
    expect(visitor.replyTo).toBe("team@example.com");
    expect(visitor.text).toMatch(/^Hi Ama,/);
    expect(visitor.text).toContain("expert consultation request");
    expect(visitor.text).toContain("Nothing is booked yet");
    // Never repeats the visitor's own text.
    for (const own of [
      "Smart irrigation",
      "abstract",
      "Choosing sensors",
      "Mensah",
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
    expect(headerSafe("Ama\r\nBcc: evil@example.com")).toBe("Ama Bcc: evil@example.com");
    const { team } = build({ ...consultation, fullName: "Ama\r\nMensah" });
    expect(team.subject).not.toMatch(/[\r\n]/);
    expect(team.replyTo.name).not.toMatch(/[\r\n]/);
  });

  it("helpers", () => {
    expect(firstName("  Kofi Annan-Boateng ")).toBe("Kofi");
    expect(formatGmt(new Date("2026-01-02T03:04:00Z"))).toBe("2 Jan 2026, 03:04 GMT");
  });
});
