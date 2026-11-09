import { describe, expect, it, vi } from "vitest";
import { createHandler, isTestSecret, SITEVERIFY_URL } from "../lib/handler.js";

const REAL_SECRET = "0x4AAAAAAAexample-real-secret";
// Cloudflare's published dummy key, assembled to avoid a literal match in deploy scans.
const TEST_SECRET = `1x${"0".repeat(31)}AA`;
const fullEnv = {
  TURNSTILE_SECRET_KEY: REAL_SECRET,
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_USER: "user",
  SMTP_PASS: "pass",
  MAIL_FROM: "no-reply@example.com",
  TEAM_INBOX: "team@example.com",
};

const goodBody = () => ({
  service: "sourcing",
  components: "ESP32 dev board x 2, DHT22 x 1",
  neededBy: "",
  fullName: "Example Builder",
  email: "example.builder@example.com",
  phone: "0244 000 111",
  town: "Takoradi",
  storeOptIn: false,
  consent: true,
  website: "",
  fillMs: 12000,
  turnstileToken: "token-abc",
});

function setup({
  env = fullEnv,
  siteverify = { success: true, hostname: "eratechgh.com" },
  sendMail,
} = {}) {
  const fetch = vi.fn(async () => new Response(JSON.stringify(siteverify)));
  const transport = { sendMail: sendMail ?? vi.fn(async () => ({})) };
  const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const handler = createHandler({
    env,
    fetch,
    createTransport: () => transport,
    now: () => new Date("2026-11-09T10:00:00Z"),
    randomBytes: (n) => Uint8Array.from({ length: n }, (_, i) => i + 7),
    log,
  });
  return { handler, fetch, transport, log };
}

const post = (body, init = {}) =>
  new Request("https://eratechgh.com/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
    ...init,
  });

const ctx = { ip: "203.0.113.5", deploy: { context: "production" } };

async function call(handler, req, context = ctx) {
  const res = await handler(req, context);
  return { status: res.status, body: await res.json() };
}

describe("request handler", () => {
  it("happy path: verifies Turnstile, sends team then visitor email, returns a reference", async () => {
    const { handler, fetch, transport } = setup();
    const { status, body } = await call(handler, post(goodBody()));
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true, reference: expect.stringMatching(/^PD-[A-Z0-9]{6}$/) });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe(SITEVERIFY_URL);
    const sent = new URLSearchParams(init.body);
    expect(sent.get("secret")).toBe(REAL_SECRET);
    expect(sent.get("response")).toBe("token-abc");
    expect(sent.get("remoteip")).toBe("203.0.113.5");

    expect(transport.sendMail).toHaveBeenCalledTimes(2);
    const [team] = transport.sendMail.mock.calls[0];
    const [visitor] = transport.sendMail.mock.calls[1];
    expect(team.to).toBe("team@example.com");
    expect(team.subject).toBe(`[Project Desk] Sourcing — Example Builder — ${body.reference}`);
    expect(visitor.to).toBe("example.builder@example.com");
    expect(visitor.replyTo).toBe("team@example.com");
  });

  it("rejects anything but POST", async () => {
    const { handler } = setup();
    const res = await handler(new Request("https://eratechgh.com/api/request"), ctx);
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");
  });

  it("rejects oversize bodies before parsing", async () => {
    const { handler, fetch } = setup();
    const big = { ...goodBody(), components: "x".repeat(21 * 1024) };
    const { status, body } = await call(handler, post(big));
    expect(status).toBe(413);
    expect(body.error).toBe("too_large");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects bad JSON", async () => {
    const { handler } = setup();
    expect((await call(handler, post("{nope"))).status).toBe(400);
    expect((await call(handler, post("[1,2]"))).body.error).toBe("bad_request");
  });

  it("rejects unknown fields (including another service's fields)", async () => {
    const { handler, transport } = setup();
    for (const extra of [{ isAdmin: true }, { abstract: "x".repeat(60) }]) {
      const { status, body } = await call(handler, post({ ...goodBody(), ...extra }));
      expect(status).toBe(400);
      expect(body.error).toBe("unknown_fields");
    }
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("honeypot: pretends success, sends nothing, skips Turnstile", async () => {
    const { handler, fetch, transport } = setup();
    const { status, body } = await call(handler, post({ ...goodBody(), website: "http://spam" }));
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("too fast (or no fill time) is rejected", async () => {
    const { handler, transport } = setup();
    for (const fillMs of [1500, undefined, "9000"]) {
      const { status, body } = await call(handler, post({ ...goodBody(), fillMs }));
      expect(status).toBe(400);
      expect(body.error).toBe("too_fast");
    }
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("Turnstile failure, missing token and wrong hostname are rejected", async () => {
    let t = setup({ siteverify: { success: false, "error-codes": ["invalid-input-response"] } });
    expect((await call(t.handler, post(goodBody()))).body.error).toBe("turnstile");
    expect(t.transport.sendMail).not.toHaveBeenCalled();

    t = setup();
    expect((await call(t.handler, post({ ...goodBody(), turnstileToken: "" }))).body.error).toBe(
      "turnstile",
    );

    t = setup({ siteverify: { success: true, hostname: "evil.example" } });
    expect((await call(t.handler, post(goodBody()))).body.error).toBe("turnstile");
  });

  it("skips the hostname check with Cloudflare's test secret", async () => {
    expect(isTestSecret(TEST_SECRET)).toBe(true);
    expect(isTestSecret(REAL_SECRET)).toBe(false);
    const { handler } = setup({
      env: { ...fullEnv, TURNSTILE_SECRET_KEY: TEST_SECRET },
      siteverify: { success: true, hostname: "example.com" },
    });
    expect((await call(handler, post(goodBody()))).status).toBe(200);
  });

  it("returns field errors from the shared rules", async () => {
    const { handler, transport } = setup();
    const { status, body } = await call(handler, post({ ...goodBody(), phone: "abc", town: "" }));
    expect(status).toBe(400);
    expect(body.error).toBe("validation");
    expect(Object.keys(body.fields).sort()).toEqual(["phone", "town"]);
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("rejects requests without consent", async () => {
    const { handler, transport } = setup();
    for (const consent of [false, undefined]) {
      const { status, body } = await call(handler, post({ ...goodBody(), consent }));
      expect(status).toBe(400);
      expect(body.fields.consent).toBeTruthy();
    }
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("team email shows consent", async () => {
    const { handler, transport } = setup();
    await call(handler, post(goodBody()));
    expect(transport.sendMail.mock.calls[0][0].text).toContain("Consent: yes");
  });

  it("team email failure → error; confirmation failure → still sent", async () => {
    let t = setup({ sendMail: vi.fn().mockRejectedValueOnce(new Error("smtp down")) });
    expect((await call(t.handler, post(goodBody()))).status).toBe(502);
    expect(t.transport.sendMail).toHaveBeenCalledTimes(1);

    t = setup({
      sendMail: vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("bounce")),
    });
    const r = await call(t.handler, post(goodBody()));
    expect(r.status).toBe(200);
    expect(t.log.error).toHaveBeenCalledWith(expect.stringContaining("Confirmation email failed"));
  });

  it("production with missing config → 500 and a clear log line", async () => {
    const { handler, log } = setup({ env: { TURNSTILE_SECRET_KEY: REAL_SECRET } });
    const { status } = await call(handler, post(goodBody()));
    expect(status).toBe(500);
    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining("Missing configuration in production"),
    );
  });

  it("dry run outside production: logs the emails instead of sending", async () => {
    const { handler, log, transport } = setup({ env: {} });
    const { status, body } = await call(handler, post(goodBody()), { deploy: { context: "dev" } });
    expect(status).toBe(200);
    expect(body.ok).toBe(true);
    expect(transport.sendMail).not.toHaveBeenCalled();
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining("DRY RUN"));
  });
});
