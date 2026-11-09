import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { site, visibleNav } from "../../content/site.js";
import { Button } from "../ui/Button.jsx";

export function Header() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const location = useLocation();
  const nav = visibleNav();

  // Close the menu after any navigation (including hash links on the same page).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [location.key]);

  // Escape closes and returns focus to the button; focus moves into the panel on open.
  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector("a")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <a
        href="#main"
        className="sr-only-focusable absolute top-2 left-4 z-40 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
      >
        {site.header.skipLink}
      </a>
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 md:px-6">
        <Link
          to="/"
          className="rounded-control text-base font-semibold whitespace-nowrap text-text-primary no-underline"
        >
          {site.wordmark}
        </Link>

        <nav aria-label={site.header.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.hash}>
                <Link
                  to={{ pathname: "/", hash: item.hash }}
                  className="inline-flex min-h-11 items-center rounded-control px-3 text-sm font-medium text-text-secondary no-underline hover:bg-surface-hover hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button to={site.startRequest.to} className="hidden md:inline-flex">
            {site.startRequest.label}
          </Button>
          <button
            ref={buttonRef}
            type="button"
            className="btn btn-ghost -mr-3 px-3 lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X aria-hidden="true" size={22} strokeWidth={1.75} />
            ) : (
              <Menu aria-hidden="true" size={22} strokeWidth={1.75} />
            )}
            <span className="sr-only">{open ? site.header.menuClose : site.header.menuOpen}</span>
          </button>
        </div>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        className="menu-panel absolute inset-x-0 top-full border-b border-border bg-background shadow-(--shadow-overlay) lg:hidden"
      >
        <nav aria-label={site.header.navLabel} className="mx-auto max-w-content px-4 py-3 md:px-6">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.hash}>
                <Link
                  to={{ pathname: "/", hash: item.hash }}
                  className="flex min-h-11 items-center rounded-control px-3 text-base font-medium text-text-primary no-underline hover:bg-surface-hover"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-border pt-4 pb-1 md:hidden">
            <Button to={site.startRequest.to} className="w-full" onClick={() => setOpen(false)}>
              {site.startRequest.label}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
