import { describe, expect, it } from "vitest";
import {
  addDays,
  allowedKeys,
  makeReference,
  priceLine,
  validateField,
  validateRequest,
} from "./request-rules.js";

const today = "2026-11-09";
const details = {
  fullName: "Kwame O'Neil-Boateng Jr.",
  email: "kwame.boateng@example.com",
  phone: "+233 24 555 0101",
  town: "Kumasi",
  storeOptIn: false,
};

const good = {
  sourcing: { service: "sourcing", components: "ESP32 dev board x 2", neededBy: "", ...details },
  assessment: {
    service: "assessment",
    projectTitle: "Solar tracker",
    projectArea: "energy",
    description: "",
    ...details,
  },
  consultation: {
    service: "consultation",
    projectTitle: "Smart irrigation",
    abstract: "A".repeat(50),
    guidance: "Which sensors to use",
    preferredDate: addDays(today, 1),
    preferredTime: "morning",
    discountRequested: true,
    ...details,
  },
};

describe("validateRequest — good input", () => {
  it.each(Object.keys(good))("accepts a good %s request", (service) => {
    const result = validateRequest(good[service], { today });
    expect(result.errors).toEqual({});
    expect(result.ok).toBe(true);
  });

  it("trims values", () => {
    const r = validateRequest({ ...good.sourcing, town: "  Tamale  " }, { today });
    expect(r.data.town).toBe("Tamale");
  });

  it("accepts sourcing needed-by today", () => {
    expect(validateRequest({ ...good.sourcing, neededBy: today }, { today }).ok).toBe(true);
  });
});

describe("validateRequest — bad input", () => {
  const bad = (service, patch) => validateRequest({ ...good[service], ...patch }, { today }).errors;

  it("rejects an unknown service", () => {
    expect(validateRequest({ service: "repair" }).ok).toBe(false);
  });

  it.each([
    ["fullName", "A"],
    ["fullName", "A".repeat(81)],
    ["fullName", "Ama2 Mensah"],
    ["fullName", "Ama <script>"],
    ["email", "not-an-email"],
    ["email", `${"a".repeat(250)}@x.com`],
    ["email", "ama@example.com\r\nBcc: x@y.z"],
    ["phone", "12345678"],
    ["phone", "0".repeat(21)],
    ["phone", "024-555-0101"],
    ["town", "K"],
    ["town", ""],
  ])("details: %s = %j is rejected", (name, value) => {
    expect(bad("sourcing", { [name]: value })[name]).toBeTruthy();
  });

  it("sourcing: components 10–5000, needed-by not in the past", () => {
    expect(bad("sourcing", { components: "short" }).components).toBeTruthy();
    expect(bad("sourcing", { components: "x".repeat(5001) }).components).toBeTruthy();
    expect(bad("sourcing", { neededBy: "2026-11-08" }).neededBy).toBeTruthy();
    expect(bad("sourcing", { neededBy: "2026-02-30" }).neededBy).toBeTruthy();
  });

  it("assessment: title 3–120, area from the list, description ≤ 1000", () => {
    expect(bad("assessment", { projectTitle: "ab" }).projectTitle).toBeTruthy();
    expect(bad("assessment", { projectTitle: "x".repeat(121) }).projectTitle).toBeTruthy();
    expect(bad("assessment", { projectArea: "space" }).projectArea).toBeTruthy();
    expect(bad("assessment", { description: "x".repeat(1001) }).description).toBeTruthy();
    expect(bad("assessment", { projectArea: "" }).projectArea).toBeUndefined();
  });

  it("consultation: abstract 50–5000, guidance 10–1500, date tomorrow+, time from list", () => {
    expect(bad("consultation", { abstract: "x".repeat(49) }).abstract).toBeTruthy();
    expect(bad("consultation", { abstract: "x".repeat(5001) }).abstract).toBeTruthy();
    expect(bad("consultation", { guidance: "too short" }).guidance).toBeTruthy();
    expect(bad("consultation", { guidance: "x".repeat(1501) }).guidance).toBeTruthy();
    expect(bad("consultation", { preferredDate: today }).preferredDate).toBeTruthy();
    expect(bad("consultation", { preferredDate: "" }).preferredDate).toBeTruthy();
    expect(bad("consultation", { preferredTime: "night" }).preferredTime).toBeTruthy();
  });

  it("rejects wrong types instead of coercing them", () => {
    expect(bad("consultation", { discountRequested: "yes" }).discountRequested).toBeTruthy();
    expect(bad("sourcing", { town: 42 }).town).toBeTruthy();
  });
});

describe("helpers", () => {
  it("validateField matches validateRequest", () => {
    expect(validateField("phone", "abc")).toBe("Use digits, spaces and + only.");
    expect(validateField("phone", "+233 24 555 0101")).toBeNull();
  });

  it("allowedKeys covers only the chosen service", () => {
    expect(allowedKeys("sourcing").has("components")).toBe(true);
    expect(allowedKeys("sourcing").has("abstract")).toBe(false);
  });

  it("price lines", () => {
    expect(priceLine("sourcing")).toBe("Free quote");
    expect(priceLine("assessment")).toBe("GH₵50");
    expect(priceLine("consultation")).toBe("GH₵250");
    expect(priceLine("consultation", true)).toBe("GH₵75 if eligible");
  });

  it("makes references like PD-7K3QX2", () => {
    const ref = makeReference((n) => Uint8Array.from({ length: n }, (_, i) => i * 37));
    expect(ref).toMatch(/^PD-[2-9A-HJ-NP-Z]{6}$/);
  });
});
