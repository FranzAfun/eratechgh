import { Link } from "react-router";
import { site, visibleNav } from "../../content/site.js";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface-soft">
      <div className="mx-auto grid max-w-content gap-6 px-4 py-10 text-sm md:grid-cols-[1fr_auto] md:px-6">
        <div>
          <p className="text-base font-semibold text-text-primary">{site.wordmark}</p>
          <p className="mt-2 text-text-secondary">{site.tagline}</p>
          {site.teamEmail ? (
            <p className="mt-3 text-text-secondary">
              {site.footer.contactLabel}:{" "}
              <a
                className="font-medium text-primary-text underline"
                href={`mailto:${site.teamEmail}`}
              >
                {site.teamEmail}
              </a>
            </p>
          ) : null}
        </div>
        <nav aria-label={site.footer.navLabel}>
          <ul className="flex flex-wrap gap-x-1 gap-y-1 md:justify-end">
            {visibleNav().map((item) => (
              <li key={item.hash}>
                <Link
                  to={{ pathname: "/", hash: item.hash }}
                  className="inline-flex min-h-11 items-center rounded-control px-2 text-text-secondary underline-offset-3 hover:text-text-primary hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={site.startRequest.to}
                className="inline-flex min-h-11 items-center rounded-control px-2 text-text-secondary underline-offset-3 hover:text-text-primary hover:underline"
              >
                {site.startRequest.label}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6 text-text-muted md:col-span-2">
          <span suppressHydrationWarning>{site.footer.copyright(year)}</span>
          {site.privacyUrl ? (
            <a
              className="text-text-secondary underline underline-offset-3 hover:text-text-primary"
              href={site.privacyUrl}
              rel="noopener"
            >
              {site.footer.privacy}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
