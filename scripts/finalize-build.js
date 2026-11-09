/**
 * Runs after `react-router build` (see react-router.config.js):
 * 1. checks every prerendered page has an index.html,
 * 2. copies the prerendered 404 page to 404.html (Netlify serves it for unknown URLs),
 * 3. writes build/client/_headers with a Content-Security-Policy that allows
 *    React Router's inline hydration scripts by hash (no 'unsafe-inline' for scripts).
 */
import { createHash } from "node:crypto";
import { copyFile, readFile, readdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const TURNSTILE = "https://challenges.cloudflare.com";

/** Returns the contents of every inline <script> (no src attribute) in an HTML string. */
export function inlineScripts(html) {
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  return [...html.matchAll(re)].map((m) => m[1]).filter((s) => s.trim() !== "");
}

/** CSP source expression for one inline script. */
export function scriptHash(content) {
  return `'sha256-${createHash("sha256").update(content, "utf8").digest("base64")}'`;
}

/** The full Content-Security-Policy value for the given inline-script hashes. */
export function buildCsp(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${TURNSTILE} ${[...hashes].sort().join(" ")}`.trim(),
    // React and Turnstile set inline styles; styles cannot run code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    `frame-src ${TURNSTILE}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

export async function finalizeBuild(buildDirectory, prerenderedPaths) {
  const client = path.join(buildDirectory, "client");

  for (const p of prerenderedPaths) {
    const file = path.join(client, p, "index.html");
    try {
      await access(file);
    } catch {
      throw new Error(`Prerender check failed: missing ${path.relative(buildDirectory, file)}`);
    }
  }

  await copyFile(path.join(client, "404", "index.html"), path.join(client, "404.html"));

  const hashes = new Set();
  for (const file of await htmlFiles(client)) {
    for (const s of inlineScripts(await readFile(file, "utf8"))) hashes.add(scriptHash(s));
  }

  const headers = `/*\n  Content-Security-Policy: ${buildCsp(hashes)}\n`;
  await writeFile(path.join(client, "_headers"), headers);
  console.log(`finalize-build: ${hashes.size} inline script hash(es) written to _headers`);
}
