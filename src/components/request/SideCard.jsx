import { MessageCircle } from "lucide-react";
import { site } from "../../content/site.js";
import { priceLine } from "../../lib/request-rules.js";

/**
 * "What happens next" + price for the picked service. Sticky beside the form on desktop;
 * compact above the send button on phones and tablets.
 */
export function SideCard({ service, discountRequested, compact = false, className = "" }) {
  const t = site.request;
  const info = site.services.find((s) => s.slug === service);
  return (
    <section
      aria-labelledby={compact ? "side-title-compact" : "side-title"}
      className={`rounded-card border border-border bg-surface ${compact ? "p-4" : "p-6 shadow-(--shadow-resting)"} ${className}`}
    >
      <h2
        id={compact ? "side-title-compact" : "side-title"}
        className={`${compact ? "text-base" : "text-h3"} font-semibold`}
      >
        {t.sideTitle}
      </h2>
      {info ? (
        <>
          <p className="mt-3 flex items-baseline justify-between gap-4 rounded-control bg-surface-soft px-3 py-2">
            <span className="text-sm text-text-secondary">{info.name}</span>
            <span
              aria-live="polite"
              className={`${compact ? "text-base" : "text-h3"} font-bold text-primary-text`}
            >
              {priceLine(service, discountRequested)}
            </span>
          </p>
          <ol
            className={`mt-4 space-y-3 text-sm text-text-secondary ${compact ? "hidden sm:block" : ""}`}
          >
            {info.steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-6 flex-none place-items-center rounded-pill bg-surface-strong text-xs font-semibold text-primary-text"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-sm text-text-muted">
            <MessageCircle aria-hidden="true" size={16} strokeWidth={1.75} className="flex-none" />
            {t.sideReply}
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-text-muted">{t.sideEmpty}</p>
      )}
    </section>
  );
}
