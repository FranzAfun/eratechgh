/**
 * Shared request rules: used by the form (src/components/request) and the function
 * (netlify/functions/request.mjs). Change a rule here and both sides follow.
 * Pure JavaScript, no browser or Node APIs.
 */

export const SERVICE_SLUGS = ["sourcing", "assessment", "consultation"];

export const PROJECT_AREAS = [
  { value: "iot", label: "IoT & embedded" },
  { value: "robotics", label: "Robotics & automation" },
  { value: "electronics", label: "Electronics" },
  { value: "energy", label: "Energy & power" },
  { value: "other", label: "Other" },
];

export const PREFERRED_TIMES = [
  { value: "morning", label: "Morning (9–12)" },
  { value: "afternoon", label: "Afternoon (12–4)" },
  { value: "evening", label: "Evening (4–7)" },
];

/** Whole request body limit, in bytes. */
export const MAX_BODY_BYTES = 20 * 1024;
/** Minimum time between the form appearing and being sent. */
export const MIN_FILL_MS = 4000;

/** Fields every service has, in form order. */
export const DETAIL_FIELDS = ["fullName", "email", "phone", "town"];

/** Service-specific fields, in form order. */
export const SERVICE_FIELDS = {
  sourcing: ["components", "neededBy"],
  assessment: ["projectTitle", "projectArea", "description"],
  consultation: [
    "projectTitle",
    "abstract",
    "guidance",
    "preferredDate",
    "preferredTime",
    "discountRequested",
  ],
};

/** Not user fields: honeypot, form start time, Turnstile token. */
export const META_FIELDS = ["website", "startedAt", "turnstileToken"];

export const EXTRA_FIELDS = ["storeOptIn"];

const BOOLEAN_FIELDS = new Set(["discountRequested", "storeOptIn"]);

/** Every key a request for `service` may contain. Anything else is rejected. */
export function allowedKeys(service) {
  return new Set([
    "service",
    ...DETAIL_FIELDS,
    ...(SERVICE_FIELDS[service] ?? []),
    ...EXTRA_FIELDS,
    ...META_FIELDS,
  ]);
}

/** User-facing fields for a service, in form order (used for focusing the first error). */
export function fieldOrder(service) {
  return [...(SERVICE_FIELDS[service] ?? []), ...DETAIL_FIELDS];
}

/** Today's date as YYYY-MM-DD in Ghana (GMT, no daylight saving). */
export function todayGhana(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const NAME_RE = /^[\p{L}\p{M}' .-]+$/u;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^[0-9 +]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value) {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function length(value, min, max, label) {
  if (value.length === 0) return `Enter ${label}.`;
  if (value.length < min) return `Use at least ${min.toLocaleString("en-GB")} characters.`;
  if (value.length > max) return `Use ${max.toLocaleString("en-GB")} characters or fewer.`;
  return null;
}

/**
 * Field rules. Each takes the trimmed value (string or boolean) and the context
 * { today } and returns an error message or null.
 */
const RULES = {
  fullName: (v) =>
    length(v, 2, 80, "your full name") ??
    (NAME_RE.test(v) ? null : "Use letters, spaces, apostrophes, hyphens and full stops only."),
  email: (v) => {
    if (v.length === 0) return "Enter your email address.";
    if (v.length > 254 || !EMAIL_RE.test(v))
      return "Enter a valid email address, like name@example.com.";
    return null;
  },
  phone: (v) => {
    if (v.length === 0) return "Enter your phone or WhatsApp number.";
    if (!PHONE_RE.test(v)) return "Use digits, spaces and + only.";
    if (v.length < 9 || v.length > 20) return "Enter 9 to 20 characters.";
    return null;
  },
  town: (v) => length(v, 2, 80, "your town or city"),

  components: (v) => length(v, 10, 5000, "the components and quantities you need"),
  neededBy: (v, { today }) => {
    if (v === "") return null;
    if (!isRealDate(v)) return "Enter a valid date.";
    if (v < today) return "Choose today or a later date.";
    return null;
  },

  projectTitle: (v) => length(v, 3, 120, "a project title"),
  projectArea: (v) =>
    v === "" || PROJECT_AREAS.some((a) => a.value === v)
      ? null
      : "Choose a project area from the list.",
  description: (v) => (v.length > 1000 ? "Use 1,000 characters or fewer." : null),

  abstract: (v) => length(v, 50, 5000, "your project abstract"),
  guidance: (v) => length(v, 10, 1500, "the guidance you need"),
  preferredDate: (v, { today }) => {
    if (v === "") return "Choose a preferred date.";
    if (!isRealDate(v)) return "Enter a valid date.";
    if (v < addDays(today, 1)) return "Choose tomorrow or a later date.";
    return null;
  },
  preferredTime: (v) =>
    PREFERRED_TIMES.some((t) => t.value === v) ? null : "Choose a preferred time.",
  discountRequested: () => null,
  storeOptIn: () => null,
};

/** Normalises a raw value: strings are trimmed (CRLF → LF), booleans stay booleans. */
export function clean(name, value) {
  if (BOOLEAN_FIELDS.has(name)) return value === true;
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim();
}

/** Validates one field. Returns an error message or null. */
export function validateField(name, value, { today = todayGhana() } = {}) {
  const rule = RULES[name];
  if (!rule) return null;
  return rule(clean(name, value), { today });
}

/** Limits for inputs (maxLength attributes). */
export const MAX_LENGTHS = {
  fullName: 80,
  email: 254,
  phone: 20,
  town: 80,
  components: 5000,
  projectTitle: 120,
  description: 1000,
  abstract: 5000,
  guidance: 1500,
};

/**
 * Validates a whole request (user fields only; meta fields are checked by the function).
 * Returns { ok, errors: { field: message }, data } where data holds the cleaned values.
 */
export function validateRequest(input, { today = todayGhana() } = {}) {
  const errors = {};
  const service = input?.service;
  if (!SERVICE_SLUGS.includes(service)) {
    return { ok: false, errors: { service: "Choose a service." }, data: null };
  }
  const data = { service };
  for (const name of [...SERVICE_FIELDS[service], ...DETAIL_FIELDS, ...EXTRA_FIELDS]) {
    const raw = input[name];
    // Wrong types are errors, not silently fixed.
    const expected = BOOLEAN_FIELDS.has(name) ? "boolean" : "string";
    if (raw !== undefined && typeof raw !== expected) {
      errors[name] = "This value isn't valid.";
      continue;
    }
    const value = clean(name, raw);
    data[name] = value;
    const error = RULES[name](value, { today });
    if (error) errors[name] = error;
  }
  return { ok: Object.keys(errors).length === 0, errors, data };
}

/** The price line shown for a service (and on the team email). */
export function priceLine(service, discountRequested = false) {
  if (service === "sourcing") return "Free quote";
  if (service === "assessment") return "GH₵50";
  if (service === "consultation") return discountRequested ? "GH₵75 if eligible" : "GH₵250";
  return "";
}

/** Makes a reference like PD-7K3QX2. Pass a random source (bytes) for tests. */
export function makeReference(randomBytes) {
  // No 0/O or 1/I so references are easy to read out on the phone.
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = randomBytes(6);
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[bytes[i] % alphabet.length];
  return `PD-${out}`;
}
