import { Check, CircleCheck, ListChecks } from "lucide-react";
import { site } from "../../content/site.js";
import { Button } from "../ui/Button.jsx";
import { LivingCircuit } from "./LivingCircuit.jsx";

/** Dark home hero (DESIGN-DIRECTION.md §3). The header sits over it. */
export function Hero() {
  const t = site.home.hero;
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark hero-ground relative isolate overflow-hidden text-text-inverse lg:min-h-[100dvh]"
    >
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />

      {/* Phones and tablets: the board sits faintly behind the words. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-20 -z-10 flex justify-end opacity-25 lg:hidden"
      >
        <LivingCircuit className="mr-[-18%] w-[115%] max-w-[640px] sm:mr-[-8%] sm:w-[80%]" />
      </div>

      <div className="mx-auto grid max-w-content items-center gap-12 px-4 pt-28 pb-16 md:px-6 md:pt-32 md:pb-20 lg:min-h-[100dvh] lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="hero-in inline-flex rounded-pill border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-text-on-dark sm:text-sm">
            {t.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="hero-in mt-6 max-w-[15em] text-hero font-semibold text-balance [animation-delay:80ms]"
          >
            {t.title}
          </h1>
          <p className="hero-in mt-6 max-w-[34em] text-base text-text-on-dark [animation-delay:160ms] md:text-lg">
            {t.body}
          </p>
          <div className="hero-in mt-8 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Button to={t.primary.to} className="w-full sm:w-auto">
              {t.primary.label}
            </Button>
            <Button to={t.secondary.to} variant="secondary" className="w-full sm:w-auto">
              {t.secondary.label}
            </Button>
          </div>
          <ul className="hero-in mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-on-dark [animation-delay:320ms]">
            {t.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <Check aria-hidden="true" size={16} strokeWidth={2} className="text-accent" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: the living board with the quote card over its corner. */}
        <div aria-hidden="true" className="relative hidden lg:block">
          <LivingCircuit className="ml-auto block w-[88%]" />
          <QuoteCard />
        </div>
      </div>
    </section>
  );
}

function QuoteCard() {
  const t = site.home.hero.card;
  return (
    <div className="glass absolute -bottom-8 left-0 w-52 rounded-dialog border border-(--glass-border) p-4 shadow-(--shadow-overlay)">
      <p className="flex items-center gap-2 text-sm font-semibold text-text-inverse">
        <ListChecks size={16} strokeWidth={1.75} className="text-accent" />
        {t.title}
      </p>
      <ul className="mt-3 space-y-2">
        {t.rows.map((row) => (
          <li
            key={row}
            className="flex items-center justify-between gap-2 rounded-control bg-glass-fill px-3 py-2 text-xs text-text-on-dark"
          >
            {row}
            <span className="size-1.5 rounded-pill bg-accent" />
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-2 rounded-control border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-text-inverse">
        <CircleCheck size={16} strokeWidth={2} className="text-accent" />
        {t.status}
      </p>
    </div>
  );
}
