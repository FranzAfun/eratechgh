import { Check, ChevronDown } from "lucide-react";
import { HeroVisual } from "../components/home/HeroVisual.jsx";
import { illustrations } from "../components/home/Illustrations.jsx";
import { Button } from "../components/ui/Button.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";
import { hasPortfolio, site } from "../content/site.js";
import { pageMeta } from "../lib/meta.js";

export const meta = () =>
  pageMeta(
    null,
    "Component sourcing, project assessments and expert consultations for students, makers and innovators in Ghana. Send one request to the ERA Tech team.",
  );

const wrap = "mx-auto max-w-content px-4 md:px-6";
const section = "py-14 md:py-20";

export default function Home() {
  const h = site.home;
  return (
    <>
      <Hero />
      <Services />
      <Design />
      {hasPortfolio() ? <Work /> : null}
      <HowItWorks />
      <Store />
      <Faq />
      <section aria-labelledby="closing-title" className="on-dark bg-primary">
        <div
          className={`${wrap} flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between`}
        >
          <h2 id="closing-title" className="text-h2 font-semibold text-text-inverse">
            {h.closing.title}
          </h2>
          <CtaPair />
        </div>
      </section>
    </>
  );
}

function CtaPair() {
  const { primary, secondary } = site.home.hero;
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button to={primary.to} className="w-full sm:w-auto">
        {primary.label}
      </Button>
      <Button to={secondary.to} variant="secondary" className="w-full sm:w-auto">
        {secondary.label}
      </Button>
    </div>
  );
}

function Hero() {
  const t = site.home.hero;
  return (
    <section aria-labelledby="hero-title" className="bg-surface-soft">
      <div
        className={`${wrap} grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20`}
      >
        <div>
          <h1
            id="hero-title"
            className="max-w-[14em] text-hero font-semibold text-balance text-text-primary"
          >
            {t.title}
          </h1>
          <p className="mt-5 max-w-text text-base text-text-secondary md:text-h3 md:font-normal">
            {t.body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to={t.primary.to} className="w-full sm:w-auto">
              {t.primary.label}
            </Button>
            <Button to={t.secondary.to} variant="secondary" className="w-full sm:w-auto">
              {t.secondary.label}
            </Button>
          </div>
          <p className="mt-6 text-sm text-text-muted">{site.tagline}</p>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function Services() {
  const t = site.home.services;
  return (
    <section id="services" aria-labelledby="services-title" className={section}>
      <div className={wrap}>
        <SectionHeading id="services-title" title={t.title} intro={t.intro} />
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {site.services.map((s) => (
            <li
              key={s.slug}
              className={`flex flex-col rounded-card border bg-surface p-4 sm:p-6 ${
                s.featured ? "border-primary shadow-(--shadow-resting)" : "border-border"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-h3 font-semibold">{s.name}</h3>
                {s.badge ? (
                  <span className="rounded-pill bg-surface-strong px-3 py-1 text-xs font-medium text-primary-text">
                    {s.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-h2 font-bold text-primary-text">{s.price}</p>
              <p className="mt-1 text-sm text-text-secondary">{s.priceNote}</p>
              <p className="mt-4 text-sm text-text-primary">{s.summary}</p>
              <p className="mt-5 text-xs font-medium text-text-muted">{t.stepsLabel}</p>
              <ol className="mt-2 space-y-2 text-sm text-text-secondary">
                {s.steps.map((step, i) => (
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
              <div className="mt-auto pt-6">
                <Button
                  to={`/request/${s.slug}`}
                  variant={s.featured ? "primary" : "secondary"}
                  className="w-full"
                >
                  {s.cta}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Design() {
  const t = site.home.design;
  return (
    <section
      id="design"
      aria-labelledby="design-title"
      className={`on-dark bg-primary-deep ${section}`}
    >
      <div className={wrap}>
        <SectionHeading id="design-title" title={t.title} intro={t.intro} tone="dark" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.tiles.map((tile) => {
            const Art = illustrations[tile.key];
            return (
              <li key={tile.key} className="rounded-card border border-text-inverse/12 p-4 sm:p-5">
                <figure>
                  <div className="aspect-[16/7] rounded-control sm:aspect-[8/5] bg-text-inverse/5 p-3 text-text-on-dark">
                    <Art />
                  </div>
                  <figcaption className="mt-2 text-xs text-text-on-dark">{t.caption}</figcaption>
                </figure>
                <h3 className="mt-4 text-h3 font-semibold text-text-inverse">{tile.title}</h3>
                <p className="mt-2 text-sm text-text-on-dark">{tile.body}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-sm text-text-on-dark">{t.footnote}</p>
      </div>
    </section>
  );
}

function Work() {
  const t = site.home.work;
  return (
    <section id="work" aria-labelledby="work-title" className={section}>
      <div className={wrap}>
        <SectionHeading id="work-title" title={t.title} intro={t.intro} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.portfolio.map((p) => (
            <li key={p.src}>
              <figure>
                <img
                  src={p.src}
                  width={p.width}
                  height={p.height}
                  alt={p.alt}
                  loading="lazy"
                  className="h-auto w-full rounded-card bg-surface-soft"
                />
                {p.caption ? (
                  <figcaption className="mt-2 text-sm text-text-secondary">{p.caption}</figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = site.home.howItWorks;
  return (
    <section id="how-it-works" aria-labelledby="how-title" className={`bg-surface-soft ${section}`}>
      <div className={wrap}>
        <SectionHeading id="how-title" title={t.title} />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {t.steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-card border border-border bg-surface p-4 sm:p-6"
            >
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-pill bg-primary text-sm font-semibold text-on-primary"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-h3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Store() {
  const t = site.home.store;
  return (
    <section aria-labelledby="store-title" className={section}>
      <div className={wrap}>
        <div className="grid gap-8 rounded-card border border-border p-4 sm:p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
          {/* Wide logo only at 80 px tall or more (DESIGN-SYSTEM.md → Logos). */}
          <img
            src="/era-store/era-store-logo-wide-purple.svg"
            alt={t.logoAlt}
            width="202"
            height="80"
            className="h-20 w-auto"
          />
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill bg-primary py-1 pr-3 pl-2 text-xs font-medium text-on-primary">
              <img src="/era-store/era-store-symbol-white.svg" alt="" width="16" height="16" />
              {t.badge}
            </span>
            <h2 id="store-title" className="mt-3 text-h2 font-semibold">
              {t.title}
            </h2>
            <p className="mt-3 text-base text-text-secondary">{t.intro}</p>
            <ul className="mt-4 grid gap-2 text-sm text-text-primary sm:grid-cols-2">
              {t.offers.map((o) => (
                <li key={o} className="flex gap-2">
                  <Check
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.75}
                    className="flex-none text-primary-text"
                  />
                  {o}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-text-secondary">{t.notify}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const t = site.home.faq;
  return (
    <section id="faq" aria-labelledby="faq-title" className={`bg-surface-soft ${section}`}>
      <div className={`${wrap} grid gap-8 lg:grid-cols-[1fr_2fr]`}>
        <SectionHeading id="faq-title" title={t.title} />
        <div className="divide-y divide-border rounded-card border border-border bg-surface">
          {t.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-4 py-3 text-base font-medium sm:px-5 [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.75}
                  className="flex-none text-text-muted transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="px-4 pb-4 text-sm text-text-secondary sm:px-5">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
