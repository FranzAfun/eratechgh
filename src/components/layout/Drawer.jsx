import { ChevronRight, CircleHelp, Image, LayoutGrid, ListOrdered, PenTool, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { site, visibleNav } from "../../content/site.js";
import { Button } from "../ui/Button.jsx";

const ICONS = {
  services: LayoutGrid,
  design: PenTool,
  work: Image,
  "how-it-works": ListOrdered,
  faq: CircleHelp,
};
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Body scroll lock that keeps the page where it was. */
let savedY = 0;
function lockScroll() {
  savedY = window.scrollY;
  const { style } = document.body;
  style.position = "fixed";
  style.top = `-${savedY}px`;
  style.left = "0";
  style.right = "0";
}
function unlockScroll() {
  const { style } = document.body;
  if (style.position !== "fixed") return;
  style.position = "";
  style.top = "";
  style.left = "";
  style.right = "";
  window.scrollTo({ top: savedY, behavior: "instant" });
}

/**
 * Right-side menu drawer (DESIGN-DIRECTION.md §2). Rendered in a portal; stays mounted while it
 * slides out. Focus goes to the close button, Tab is trapped, Esc and the scrim close it, the body
 * can't scroll behind it, and focus returns to the menu button. Any navigation (incl. back) closes it.
 */
export function Drawer({ open, onClose, returnFocusRef, activeHash }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const location = useLocation();
  const year = new Date().getFullYear();

  // Close (and unlock right away, so a hash link can scroll) — used by links, Esc, scrim, button.
  const close = useCallback(
    ({ restoreFocus = true } = {}) => {
      unlockScroll();
      onClose();
      if (restoreFocus) requestAnimationFrame(() => returnFocusRef.current?.focus());
    },
    [onClose, returnFocusRef],
  );

  // Mount → next frame visible (slide in). Close → slide out, then unmount.
  // Syncing animation state with `open` is what this effect is for.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setMounted(true);
      lockScroll();
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    unlockScroll();
    const t = setTimeout(() => setMounted(false), 220);
    return () => clearTimeout(t);
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Focus the close button once shown.
  useEffect(() => {
    if (visible) closeRef.current?.focus();
  }, [visible]);

  // Any navigation closes it (links, browser back/forward).
  const firstKey = useRef(location.key);
  useEffect(() => {
    if (location.key === firstKey.current) return;
    firstKey.current = location.key;
    if (open) close({ restoreFocus: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Safety: never leave the body locked if the component goes away.
  useEffect(() => unlockScroll, []);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    // The dialog handles Esc and Tab for everything inside it.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="on-dark fixed inset-0 z-50 lg:hidden" onKeyDown={onKeyDown}>
      {/* Scrim: click closes (keyboard users have Esc and the close button). */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={`drawer-scrim absolute inset-0 ${visible ? "is-open" : ""}`}
        onClick={() => close()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={site.header.menuTitle}
        className={`drawer-panel absolute top-0 right-0 flex h-dvh w-[86%] max-w-96 flex-col overflow-y-auto bg-surface-dark pb-[env(safe-area-inset-bottom)] ${visible ? "is-open" : ""}`}
      >
        <div className="flex h-16 flex-none items-center justify-between gap-3 border-b border-glass-line px-4">
          <span className="flex items-baseline gap-2 text-text-inverse">
            <span className="text-base font-semibold">{site.header.brand}</span>
            <span className="text-xs text-text-on-dark">{site.header.label}</span>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => close()}
            className="grid size-11 place-items-center rounded-pill border border-glass-line bg-glass-fill text-text-inverse hover:bg-glass-fill-hover"
          >
            <X aria-hidden="true" size={20} strokeWidth={1.75} />
            <span className="sr-only">{site.header.menuClose}</span>
          </button>
        </div>

        <nav aria-label={site.header.navLabel} className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {visibleNav().map((item) => {
              const Icon = ICONS[item.hash] ?? LayoutGrid;
              const active = activeHash === item.hash;
              return (
                <li key={item.hash}>
                  <Link
                    to={{ pathname: "/", hash: item.hash }}
                    onClick={() => close({ restoreFocus: false })}
                    aria-current={active ? "location" : undefined}
                    className={`flex min-h-14 items-center gap-3 rounded-card px-2 no-underline hover:bg-glass-fill ${
                      active ? "text-accent" : "text-text-inverse"
                    }`}
                  >
                    <span
                      className={`grid size-10 flex-none place-items-center rounded-control border ${
                        active ? "border-accent/40 bg-accent/10" : "border-glass-line bg-glass-fill"
                      }`}
                    >
                      <Icon aria-hidden="true" size={18} strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 text-base font-medium">{item.label}</span>
                    <ChevronRight
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.75}
                      className="text-text-on-dark"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-none border-t border-glass-line p-4">
          <Button
            to={site.startRequest.to}
            className="w-full"
            onClick={() => close({ restoreFocus: false })}
          >
            {site.startRequest.label}
          </Button>
          <p className="mt-4 text-center text-xs text-text-on-dark" suppressHydrationWarning>
            {site.footer.drawerCopyright(year)}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
