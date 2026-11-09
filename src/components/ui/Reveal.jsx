import { useEffect, useRef } from "react";

/**
 * Fades and lifts its content in once, when it scrolls into view.
 * - Prerendered HTML is fully visible (works without JS); only content that is still below the fold
 *   when the page hydrates gets hidden and revealed.
 * - Reduced motion: nothing is hidden or moved.
 * - `delay` (ms) staggers items in a grid: pass index × 80.
 */
export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // Already on screen (or above it): leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transitionDelay = `${delay}ms`;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
