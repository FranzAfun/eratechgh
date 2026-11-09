/**
 * POST /api/request — the one Netlify Function (see netlify/functions/request.mjs).
 *
 * Order: POST only → size ≤ 20 KB → JSON → no unknown fields → honeypot empty →
 * filled in ≥ 4 s → Turnstile (success + hostname) → shared validation → team email →
 * visitor email. Per-IP rate limiting is Netlify's (config.rateLimit). Nothing is stored.
 *
 * Everything external (env, fetch, mail transport, clock, randomness, log) is injected so the
 * handler can be tested without network or SMTP.
 */
import {
  allowedKeys,
  makeReference,
  MAX_BODY_BYTES,
  MIN_FILL_MS,
  SERVICE_SLUGS,
  validateRequest,
} from "../../src/lib/request-rules.js";
import { buildEmails, headerSafe } from "./emails.js";

export const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SMTP_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "TEAM_INBOX"];

/** Cloudflare's public test secrets (always pass / always fail / token already spent). */
export function isTestSecret(secret) {
  return /^[123]x0{31}AA$/.test(secret ?? "");
}

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

async function readBody(req) {
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return { tooLarge: true };
  if (!req.body) return { text: "" };
  // Read in chunks so an oversized body without Content-Length is cut off early.
  const reader = req.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return { tooLarge: true };
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return { text: new TextDecoder().decode(all) };
}

export function createHandler(deps) {
  const {
    env,
    fetch: fetchFn = globalThis.fetch,
    createTransport,
    now = () => new Date(),
    randomBytes,
    log = console,
  } = deps;

  return async function handler(req, context = {}) {
    const isProduction = (context.deploy?.context ?? env.CONTEXT) === "production";

    if (req.method !== "POST") {
      return json(405, { error: "method_not_allowed" }, { Allow: "POST" });
    }

    // Config: production must have everything; elsewhere missing SMTP means a dry run.
    const missingSmtp = SMTP_VARS.filter((name) => !env[name]);
    if (isProduction && (missingSmtp.length > 0 || !env.TURNSTILE_SECRET_KEY)) {
      const missing = [
        ...missingSmtp,
        ...(env.TURNSTILE_SECRET_KEY ? [] : ["TURNSTILE_SECRET_KEY"]),
      ];
      log.error(`[request] Missing configuration in production: ${missing.join(", ")}`);
      return json(500, { error: "server" });
    }
    const dryRun = missingSmtp.length > 0;

    // Size.
    const { text, tooLarge } = await readBody(req);
    if (tooLarge) return json(413, { error: "too_large" });

    // JSON.
    let input;
    try {
      input = JSON.parse(text);
    } catch {
      return json(400, { error: "bad_request" });
    }
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return json(400, { error: "bad_request" });
    }

    // Unknown fields.
    if (!SERVICE_SLUGS.includes(input.service)) {
      return json(400, { error: "validation", fields: { service: "Choose a service." } });
    }
    const allowed = allowedKeys(input.service);
    const unknown = Object.keys(input).filter((key) => !allowed.has(key));
    if (unknown.length > 0) {
      return json(400, { error: "unknown_fields" });
    }

    // Honeypot: a bot filled the hidden field. Answer like a success, send nothing.
    if (typeof input.website === "string" && input.website.trim() !== "") {
      log.info("[request] Honeypot filled; dropped.");
      return json(200, { ok: true, reference: makeReference(randomBytes) });
    }
    if (input.website !== undefined && typeof input.website !== "string") {
      return json(400, { error: "bad_request" });
    }

    // Filled in at least 4 s (measured in the browser, so clock differences don't matter).
    if (!Number.isFinite(input.fillMs) || input.fillMs < MIN_FILL_MS) {
      return json(400, { error: "too_fast" });
    }

    // Turnstile.
    const secret = env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      log.warn("[request] TURNSTILE_SECRET_KEY not set; skipping the check (not production).");
    } else {
      const token = input.turnstileToken;
      if (typeof token !== "string" || token === "" || token.length > 2048) {
        return json(400, { error: "turnstile" });
      }
      let outcome;
      try {
        const form = new URLSearchParams({ secret, response: token });
        if (context.ip) form.set("remoteip", context.ip);
        const res = await fetchFn(SITEVERIFY_URL, { method: "POST", body: form });
        outcome = await res.json();
      } catch (error) {
        log.error(`[request] Turnstile siteverify failed: ${error?.message ?? error}`);
        return json(502, { error: "server" });
      }
      if (!outcome?.success) {
        log.info(`[request] Turnstile rejected: ${(outcome?.["error-codes"] ?? []).join(", ")}`);
        return json(400, { error: "turnstile" });
      }
      // Test keys report a dummy hostname, so only real keys get the hostname check.
      const expectedHost = new URL(req.url).hostname;
      if (!isTestSecret(secret) && outcome.hostname !== expectedHost) {
        log.warn(`[request] Turnstile hostname mismatch: ${headerSafe(outcome.hostname)}`);
        return json(400, { error: "turnstile" });
      }
    }

    // Shared validation.
    const { ok, errors, data } = validateRequest(input);
    if (!ok) return json(400, { error: "validation", fields: errors });

    // Emails.
    const reference = makeReference(randomBytes);
    const { team, visitor } = buildEmails({
      data,
      reference,
      sentAt: now(),
      mailFrom: env.MAIL_FROM || "no-reply@example.invalid",
      teamInbox: env.TEAM_INBOX || "team@example.invalid",
    });

    if (dryRun) {
      log.info(
        `[request] DRY RUN (missing ${missingSmtp.join(", ")}) — emails not sent:\n` +
          JSON.stringify({ team, visitor }, null, 2),
      );
      return json(200, { ok: true, reference });
    }

    const transport = createTransport(env);
    try {
      await transport.sendMail(team);
    } catch (error) {
      log.error(`[request] Team email failed for ${reference}: ${error?.message ?? error}`);
      return json(502, { error: "server" });
    }
    try {
      await transport.sendMail(visitor);
    } catch (error) {
      // The team has the request, so it still counts as sent.
      log.error(`[request] Confirmation email failed for ${reference}: ${error?.message ?? error}`);
    }
    log.info(`[request] Sent ${reference} (${data.service}).`);
    return json(200, { ok: true, reference });
  };
}
