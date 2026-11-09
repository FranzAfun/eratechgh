import { describe, expect, it } from "vitest";
import { buildCsp, inlineScripts, scriptHash } from "./finalize-build.js";

describe("finalize-build", () => {
  it("finds only inline scripts", () => {
    const html =
      '<script src="/a.js"></script><script>window.x=1</script><script type="module">import("/b.js")</script>';
    expect(inlineScripts(html)).toEqual(["window.x=1", 'import("/b.js")']);
  });

  it("hashes like browsers do", () => {
    // echo -n 'alert(1)' | openssl dgst -sha256 -binary | base64
    expect(scriptHash("alert(1)")).toBe("'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='");
  });

  it("allows Turnstile and keeps connect-src to self", () => {
    const csp = buildCsp(new Set(["'sha256-abc'"]));
    expect(csp).toContain("script-src 'self' https://challenges.cloudflare.com 'sha256-abc'");
    expect(csp).toContain("frame-src https://challenges.cloudflare.com");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
  });
});
