import {
  CircuitBoard,
  ClipboardCheck,
  Cpu,
  MessagesSquare,
  Minus,
  Package,
  PackageSearch,
  Plus,
  Smartphone,
  Truck,
} from "lucide-react";
import { useId, useState } from "react";
import { Hero } from "../components/home/Hero.jsx";
import { illustrations } from "../components/home/Illustrations.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Reveal } from "../components/ui/Reveal.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";
import { hasPortfolio, site } from "../content/site.js";
import { pageMeta } from "../lib/meta.js";

// The home page opens with a dark hero: the header starts transparent over it.
export const handle = { darkHero: true };

export const meta = () =>
  pageMeta(
    null,
    "Component sourcing, project assessments and expert consultations for students, makers and innovators in Ghana. Send one request to the ERA Tech team.",
  );

export const SERVICE_ICONS = {
  sourcing: PackageSearch,
  assessment: ClipboardCheck,
  consultation: MessagesSquare,
};
const OFFER_ICONS = {
  cpu: Cpu,
  package: Package,
  board: CircuitBoard,
  truck: Truck,
  phone: Smartphone,
};

const wrap = "mx-auto max-w-content px-4 md:px-6";
const section = "py-16 md:py-24";

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
      <section aria-labelledby="closing-title" className="on-dark closing-band text-center">
        <Reveal className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
          <h2
            id="closing-title"
            className="mx-auto max-w-[20em] text-h1 font-semibold text-balance text-text-inverse"
          >
            {h.closing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-text text-base text-text-on-dark">{h.closing.body}</p>
          <div className="mt-8 flex justify-center">
            <CtaPair />
          </div>
        </Reveal>
      </section>
    </>
  );
}

function CtaPair() {
  const { primary, secondary } = site.home.hero;
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <Button to={primary.to} className="w-full sm:w-auto">
        {primary.label}
      </Button>
      <Button to={secondary.to} variant="secondary" className="w-full sm:w-auto">
        {secondary.label}
      </Button>
    </div>
  );
}

function Services() {
  const t = site.home.services;
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={`soft-glow relative bg-background ${section}`}
    >
      <div className={wrap}>
        <Reveal>
          <SectionHeading id="services-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        </Reveal>
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {site.services.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <Reveal
                as="li"
                key={s.slug}
                delay={i * 80}
                className={`service-card relative flex flex-col rounded-card bg-surface p-5 sm:p-6 ${
                  s.featured ? "border-2 border-primary" : "border border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-card bg-surface-strong text-primary-text">
                    <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
                  </span>
                  {s.badge ? (
                    <span className="rounded-pill bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                      {s.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-h3 font-semibold">{s.name}</h3>
                <p className="mt-2 text-h1 font-bold text-primary-text">{s.price}</p>
                <p className="mt-1 text-sm text-text-secondary">{s.priceNote}</p>
                <p className="mt-4 text-sm text-text-primary">{s.summary}</p>
                <p className="mt-6 text-xs font-semibold tracking-eyebrow text-text-muted uppercase">
                  {t.stepsLabel}
                </p>
                <ol className="mt-3 space-y-3 text-sm text-text-secondary">
                  {s.steps.map((step, n) => (
                    <li key={step} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-6 flex-none place-items-center rounded-pill bg-surface-strong text-xs font-semibold text-primary-text"
                      >
                        {n + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-auto pt-8">
                  <Button
                    to={`/request/${s.slug}`}
                    variant={s.featured ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {s.cta}
                  </Button>
                </div>
              </Reveal>
            );
          })}
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
      className={`on-dark design-band relative isolate overflow-hidden ${section}`}
    >
      <div aria-hidden="true" className="line-grid absolute inset-0 -z-10" />
      <div className={wrap}>
        <Reveal>
          <SectionHeading
            id="design-title"
            eyebrow={t.eyebrow}
            title={t.title}
            intro={t.intro}
            tone="dark"
          />
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.tiles.map((tile, i) => {
            const Art = illustrations[tile.key];
            return (
              <Reveal
                as="li"
                key={tile.key}
                delay={i * 80}
                className="rounded-card border border-glass-line bg-glass-fill p-4 backdrop-blur-sm sm:p-5"
              >
                <figure>
                  <div className="aspect-[16/7] rounded-control border border-glass-line bg-bg-dark/40 p-3 text-text-on-dark sm:aspect-[8/5]">
                    <Art />
                  </div>
                  <figcaption className="mt-2 text-xs text-text-on-dark">{t.caption}</figcaption>
                </figure>
                <h3 className="mt-4 text-h3 font-semibold text-text-inverse">{tile.title}</h3>
                <p className="mt-2 text-sm text-text-on-dark">{tile.body}</p>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-10 text-sm text-text-on-dark">{t.footnote}</p>
      </div>
    </section>
  );
}

function Work() {
  const t = site.home.work;
  return (
    <section id="work" aria-labelledby="work-title" className={`bg-background ${section}`}>
      <div className={wrap}>
        <SectionHeading id="work-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.portfolio.map((p, i) => (
            <Reveal as="li" key={p.src} delay={i * 80}>
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
            </Reveal>
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
        <Reveal>
          <SectionHeading id="how-title" eyebrow={t.eyebrow} title={t.title} />
        </Reveal>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Tablet and up: one horizontal line joining the nodes. */}
          <span
            aria-hidden="true"
            className="absolute top-6 right-[16.67%] left-[16.67%] hidden h-0.5 -translate-y-1/2 bg-linear-to-r from-primary via-accent to-primary md:block"
          />
          {t.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 120}
              className="relative flex gap-5 md:flex-col md:items-center md:text-center"
            >
              {/* Phones: a vertical link down to the next node. */}
              {i < t.steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-12 -bottom-8 left-6 w-0.5 -translate-x-1/2 bg-linear-to-b from-primary to-accent md:hidden"
                />
              ) : null}
              <span
                aria-hidden="true"
                className="relative grid size-12 flex-none place-items-center rounded-pill bg-primary text-base font-semibold text-on-primary shadow-[0_0_0_6px_var(--color-surface-soft),0_0_0_7px_rgb(59_17_116/0.25)]"
              >
                {i + 1}
              </span>
              <div className="pt-2 md:pt-0">
                <h3 className="text-h3 font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-80 text-sm text-text-secondary md:mx-auto">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Store() {
  const t = site.home.store;
  const photo = site.devBoardPhoto;
  return (
    <section id="store" aria-labelledby="store-title" className={`bg-background ${section}`}>
      <div className={wrap}>
        <Reveal className="grid overflow-hidden rounded-dialog border border-border md:grid-cols-[1.15fr_1fr]">
          <div className="p-6 sm:p-10">
            {/* Wide logo only at 80 px tall or more (DESIGN-SYSTEM.md → Logos). */}
            <img
              src="/era-store/era-store-logo-wide-purple.svg"
              alt={t.logoAlt}
              width="202"
              height="80"
              className="h-20 w-auto"
            />
            <span className="mt-6 inline-flex items-center gap-2 rounded-pill bg-primary py-1 pr-3 pl-2 text-xs font-medium text-on-primary">
              <img src="/era-store/era-store-symbol-white.svg" alt="" width="16" height="16" />
              {t.badge}
            </span>
            <h2 id="store-title" className="mt-4 text-h2 font-semibold">
              {t.title}
            </h2>
            <p className="mt-3 text-base text-text-secondary">{t.intro}</p>
            <ul className="mt-5 grid gap-3 text-sm text-text-primary">
              {t.offers.map((o) => {
                const Icon = OFFER_ICONS[o.icon];
                return (
                  <li key={o.text} className="flex items-center gap-3">
                    <span className="grid size-8 flex-none place-items-center rounded-control bg-surface-strong text-primary-text">
                      <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
                    </span>
                    {o.text}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-text-secondary">{t.notify}</p>
          </div>
          <div className="store-photo grid place-items-center p-6 sm:p-10">
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(min-width: 768px) 40vw, 90vw"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              className="h-auto w-full max-w-80 mix-blend-multiply"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Faq() {
  const t = site.home.faq;
  return (
    <section id="faq" aria-labelledby="faq-title" className={`bg-surface-soft ${section}`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_2fr]`}>
        <Reveal>
          <SectionHeading id="faq-title" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        </Reveal>
        <Reveal className="divide-y divide-border rounded-card border border-border bg-surface">
          {t.items.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const Icon = open ? Minus : Plus;
  return (
    <div>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-card px-4 py-3 text-left text-base font-medium hover:bg-surface-soft sm:px-5"
        >
          {q}
          <span className="grid size-7 flex-none place-items-center rounded-pill border border-border text-primary-text">
            <Icon aria-hidden="true" size={16} strokeWidth={2} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`accordion-panel ${open ? "is-open" : ""}`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-5 text-sm text-text-secondary sm:px-5">{a}</p>
        </div>
      </div>
    </div>
  );
}
