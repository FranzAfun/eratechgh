import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildPreviewEmails, localPreviewHtml } from "./preview-emails.js";

describe("local email previews", () => {
  it("uses existing public/email files without changing production messages or link targets", () => {
    for (const [role, message] of Object.entries(buildPreviewEmails())) {
      const html = localPreviewHtml(message.html);
      const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
      expect(images).toHaveLength(6);
      expect(images[0]).toBe("../public/email/logo-white.png");
      expect(html).not.toContain('src="https://eratechgh.com/email/');
      for (const src of images) {
        expect(src).toMatch(/^\.\.\/public\/email\/[a-z-]+\.png$/);
        expect(
          existsSync(new URL(src, new URL(`../.email-previews/${role}.html`, import.meta.url))),
        ).toBe(true);
      }
      expect([...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])).toEqual(
        [...message.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]),
      );
      expect(message.html).toContain('src="https://eratechgh.com/email/logo-white.png"');
    }
  });
});
