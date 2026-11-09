import { Send } from "lucide-react";

/** Decorative sketch of a request card: shapes only, no fake names or data. */
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden w-full max-w-96 select-none md:block"
    >
      <div className="rounded-dialog border border-border bg-surface p-5 shadow-(--shadow-resting)">
        <div className="flex gap-2">
          <span className="h-8 flex-1 rounded-pill bg-primary" />
          <span className="h-8 flex-1 rounded-pill bg-surface-strong" />
          <span className="h-8 flex-1 rounded-pill bg-surface-strong" />
        </div>
        <div className="mt-5 space-y-4">
          {["w-2/5", "w-1/3", "w-1/2"].map((w) => (
            <div key={w}>
              <span className={`block h-2.5 rounded-pill bg-surface-hover ${w}`} />
              <span className="mt-2 block h-10 rounded-control border border-border" />
            </div>
          ))}
          <div>
            <span className="block h-2.5 w-1/3 rounded-pill bg-surface-hover" />
            <span className="mt-2 block h-20 rounded-control border border-border" />
          </div>
        </div>
        <div className="mt-5 flex h-11 items-center justify-center gap-2 rounded-control bg-primary text-on-primary">
          <Send size={16} strokeWidth={1.75} />
          <span className="block h-2.5 w-20 rounded-pill bg-on-primary/60" />
        </div>
      </div>
      <div className="absolute -top-3 -right-2 hidden rounded-card bg-primary-deep px-3 py-2 sm:block">
        <span className="block h-2 w-14 rounded-pill bg-accent" />
        <span className="mt-1.5 block h-2 w-9 rounded-pill bg-accent/50" />
      </div>
    </div>
  );
}
