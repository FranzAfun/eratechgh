import { site } from "../content/site.js";
import { pageMeta } from "../lib/meta.js";
import { Button } from "../components/ui/Button.jsx";

export const meta = () => pageMeta(site.notFound.title, site.notFound.metaDescription);

export function NotFoundContent() {
  const t = site.notFound;
  return (
    <section className="mx-auto max-w-text px-4 py-16 md:py-24">
      <p className="text-sm font-medium text-text-muted">404</p>
      <h1 className="mt-2 text-h1 font-semibold">{t.title}</h1>
      <p className="mt-4 text-base text-text-secondary">{t.body}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button to="/" variant="secondary" className="w-full sm:w-auto">
          {t.home}
        </Button>
        <Button to="/request" className="w-full sm:w-auto">
          {t.request}
        </Button>
      </div>
    </section>
  );
}

export default function NotFound() {
  return <NotFoundContent />;
}
