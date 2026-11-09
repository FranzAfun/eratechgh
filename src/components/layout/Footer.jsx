import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { site, visibleSiteLinks } from "../../content/site.js";

const heading = "text-xs font-semibold tracking-eyebrow text-accent uppercase";
const link =
  "inline-flex min-h-11 items-center rounded-control text-sm text-text-on-dark no-underline hover:text-accent";

/** Dark footer (DESIGN-DIRECTION.md §5): 4 columns on desktop, 2 on tablet, 1 on phones. */
export function Footer() {
  const t = site.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark border-t border-text-inverse/7 bg-bg-dark text-text-on-dark">
      <div className="mx-auto max-w-content px-4 pt-14 pb-8 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-80">
            <p className="flex items-baseline gap-2 text-text-inverse">
              <span className="text-h3 font-semibold">{site.header.brand}</span>
              <span className="text-xs text-text-on-dark">{site.header.label}</span>
            </p>
            <p className="mt-3 text-sm">{t.about}</p>
          </div>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className={heading}>
              {t.servicesTitle}
            </h2>
            <ul className="mt-3">
              {site.services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/request/${s.slug}`} className={link}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site">
            <h2 id="footer-site" className={heading}>
              {t.siteTitle}
            </h2>
            <ul className="mt-3">
              {visibleSiteLinks().map((item) => (
                <li key={item.hash}>
                  <Link to={{ pathname: "/", hash: item.hash }} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={site.startRequest.to} className={link}>
                  {site.startRequest.label}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={heading}>{t.contactTitle}</h2>
            <div className="mt-3 text-sm">
              {site.teamEmail ? (
                <a href={`mailto:${site.teamEmail}`} className={link}>
                  {site.teamEmail}
                </a>
              ) : (
                <>
                  <Link to={site.startRequest.to} className={link}>
                    {t.contactFallback}
                  </Link>
                  <p className="mt-1">{t.contactFallbackNote}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-text-inverse/7 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>{t.copyright(year)}</p>
          {site.privacyUrl ? (
            <a
              href={site.privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 self-start rounded-control text-text-on-dark hover:text-accent"
            >
              {t.privacy}
              <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.75} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
