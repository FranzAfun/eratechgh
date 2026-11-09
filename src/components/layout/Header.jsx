import { Menu } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { site, visibleNav } from "../../content/site.js";
import { useActiveSection } from "../../hooks/useActiveSection.js";
import { useScrolled } from "../../hooks/useScrolled.js";
import { Button } from "../ui/Button.jsx";
import { Drawer } from "./Drawer.jsx";
import { Wordmark } from "./Wordmark.jsx";

/**
 * Fixed header (DESIGN-DIRECTION.md §1). Over a dark hero (`overHero`) it starts transparent and turns
 * to glass after 24 px of scroll; everywhere else it is glass from the top.
 */
export function Header({ overHero = false }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const scrolled = useScrolled(24);
  const { pathname } = useLocation();
  const nav = visibleNav();
  const onHome = pathname === "/";
  const active = useActiveSection(
    nav.map((n) => n.hash),
    onHome,
  );
  const glass = !overHero || scrolled || open;

  return (
    <header
      className={`on-dark fixed inset-x-0 top-0 z-30 border-b transition-[background-color,border-color] duration-250 ${
        glass ? "glass border-(--glass-border)" : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only-focusable absolute top-2 left-4 z-40 rounded-control bg-on-primary px-4 py-2 text-sm font-semibold text-primary"
      >
        {site.header.skipLink}
      </a>
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" aria-label={site.header.homeLabel} className="rounded-control no-underline">
          <Wordmark />
        </Link>

        <nav aria-label={site.header.navLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const isActive = active === item.hash;
              return (
                <li key={item.hash}>
                  <Link
                    to={{ pathname: "/", hash: item.hash }}
                    aria-current={isActive ? "location" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-control px-3 text-sm font-medium no-underline transition-colors ${
                      isActive ? "text-accent" : "text-text-inverse/82 hover:text-text-inverse"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            to={site.startRequest.to}
            variant="secondary"
            className={`hidden md:inline-flex ${glass ? "btn-solid-dark" : ""}`}
          >
            {site.startRequest.label}
          </Button>
          <button
            ref={menuButton}
            type="button"
            className="btn btn-ghost -mr-3 px-3 lg:hidden"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" size={22} strokeWidth={1.75} />
            <span className="sr-only">{site.header.menuOpen}</span>
          </button>
        </div>
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        returnFocusRef={menuButton}
        activeHash={active}
      />
    </header>
  );
}
