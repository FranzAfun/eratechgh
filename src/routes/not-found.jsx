import { Button } from "../components/ui/Button.jsx";
import { site } from "../content/site.js";
import { pageMeta } from "../lib/meta.js";

export const meta = () => pageMeta(site.notFound.title, site.notFound.metaDescription);

// The 404 page is a dark band: the header starts transparent over it, like "/".
export const handle = { darkHero: true };

export function NotFoundContent() {
  const t = site.notFound;
  return (
    <section className="on-dark hero-ground relative isolate overflow-hidden text-text-inverse">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      {/* Top padding = header height (64 px) + space: the band runs under the fixed header. */}
      <div className="mx-auto max-w-content px-4 pt-32 pb-24 md:px-6 md:pt-40 md:pb-32">
        <p className="text-xs font-semibold tracking-eyebrow text-accent uppercase">
          {site.productName} · 404
        </p>
        <h1 className="mt-3 text-h1 font-semibold">{t.title}</h1>
        <p className="mt-4 max-w-text text-base text-text-on-dark">{t.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/request" className="w-full sm:w-auto">
            {t.request}
          </Button>
          <Button to="/" variant="secondary" className="w-full sm:w-auto">
            {t.home}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function NotFound() {
  return <NotFoundContent />;
}
