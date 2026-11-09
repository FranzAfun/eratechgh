/** Email-safe markup: user values enter only through escapeHtml or a validated link. */
import { site } from "../../src/content/site.js";
import { validateField } from "../../src/lib/request-rules.js";

// Exact colours from src/styles/tokens.css; kept inline for mail clients.
export const EMAIL_COLOURS = {
  deep: "#200940",
  primary: "#3B1174",
  accent: "#D0ADFF",
  white: "#FFFFFF",
  text: "#111111",
  secondary: "#4B5563",
  soft: "#F7F5F9",
  border: "#E5E7EB",
};
const c = EMAIL_COLOURS;
const FONT = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

/** Validation precedes URI encoding; invalid addresses never become hrefs. */
export function replyHref(address, reference) {
  if (typeof address !== "string" || validateField("email", address)) return null;
  // validateField trims inputs; reject any unclean input rather than encoding controls or spaces.
  if (address !== address.trim() || /\s/.test(address)) return null;
  return `mailto:${encodeURIComponent(address)}?subject=${encodeURIComponent(`Re: ${reference}`)}`;
}

export function paragraph(text) {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:${c.text};">${escapeHtml(text)}</p>`;
}

export function referenceChip(reference) {
  return `<span style="display:inline-block;padding:8px 12px;background-color:${c.soft};color:${c.primary};border-radius:6px;font-size:14px;line-height:20px;font-weight:600;">${escapeHtml(reference)}</span>`;
}

export function replyButton(address, reference, text) {
  const href = replyHref(address, reference);
  if (!href) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin:8px 0 24px;"><tr><td bgcolor="${c.primary}" style="background-color:${c.primary};border-radius:6px;text-align:left;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 20px;border-radius:6px;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${c.white};text-decoration:none;">${escapeHtml(text)}</a></td></tr></table>`;
}

export function fieldRow(title, value, field) {
  const escaped = escapeHtml(value).replace(/\r\n?|\n/g, "<br>");
  let href = null;
  if (field === "email" && replyHref(value, "")) href = `mailto:${encodeURIComponent(value)}`;
  if (field === "phone" && typeof value === "string" && !validateField("phone", value)) {
    href = `tel:${encodeURIComponent(value.replace(/ /g, ""))}`;
  }
  const content = href
    ? `<a href="${escapeHtml(href)}" style="color:${c.primary};text-decoration:underline;">${escaped}</a>`
    : escaped;
  return `<tr><th scope="row" width="36%" valign="top" style="padding:12px 12px 12px 0;border-bottom:1px solid ${c.border};text-align:left;font-size:14px;line-height:24px;font-weight:500;color:${c.secondary};overflow-wrap:anywhere;">${escapeHtml(title)}</th><td valign="top" style="padding:12px 0;border-bottom:1px solid ${c.border};font-size:16px;line-height:24px;color:${c.text};overflow-wrap:anywhere;word-break:break-word;">${content}</td></tr>`;
}

export function sectionRow(title) {
  return `<tr><th colspan="2" style="padding:24px 0 4px;text-align:left;font-size:16px;line-height:24px;font-weight:600;color:${c.primary};">${escapeHtml(title)}</th></tr>`;
}

/** content/headerDetails are composed only from the escaping helpers in this module. */
export function emailDocument({ preheader, heading, headerDetails = "", content, signOff }) {
  return `<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${escapeHtml(site.siteTitle)}</title></head>
<body bgcolor="${c.soft}" style="margin:0;padding:0;width:100%;background-color:${c.soft};font-family:${FONT};color:${c.text};-webkit-text-size-adjust:100%;">
<div aria-hidden="true" style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${c.secondary};">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${c.soft};font-family:${FONT};"><tr><td align="center" style="padding:24px 16px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.white}" style="width:100%;max-width:600px;border:1px solid ${c.border};border-radius:8px;border-spacing:0;background-color:${c.white};table-layout:fixed;font-family:${FONT};">
<tr><td bgcolor="${c.deep}" style="padding:24px;background-color:${c.deep};border-radius:8px 8px 0 0;color:${c.white};">
<p style="margin:0 0 24px;font-size:16px;line-height:24px;font-weight:600;color:${c.white};">${escapeHtml(site.brandName)} <span style="color:${c.accent};">·</span> ${escapeHtml(site.productName)}</p>
<h1 style="margin:0;font-size:24px;line-height:32px;font-weight:600;color:${c.white};">${escapeHtml(heading)}</h1>${headerDetails}
</td></tr>
<tr><td style="padding:24px;overflow-wrap:anywhere;">${content}<p style="margin:0;padding-top:24px;border-top:1px solid ${c.border};font-size:14px;line-height:24px;color:${c.secondary};">${escapeHtml(signOff)}</p></td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;
}
