import { useEffect, useState } from "react";

/** Returns the id of the home section currently in the middle of the screen (or null). */
export function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return undefined;
    const seen = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        setActive(key.split(",").find((id) => seen.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of key.split(",")) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}
