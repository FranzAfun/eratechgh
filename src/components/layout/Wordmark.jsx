import { site } from "../../content/site.js";

/**
 * Text wordmark: "ERA Tech · Project Desk", both names the same size and weight (semibold), with a
 * lilac mid-dot. Text only for now: swap this one component when the real logo arrives.
 * Used on dark grounds (header, drawer, footer).
 */
export function Wordmark({ size = "md" }) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 whitespace-nowrap font-semibold text-text-inverse ${
        size === "sm" ? "text-base" : "text-h3"
      }`}
    >
      <span>{site.brandName}</span>
      <span aria-hidden="true" className="text-accent">
        ·
      </span>
      <span>{site.productName}</span>
    </span>
  );
}
