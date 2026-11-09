import { useMatches } from "react-router";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";

/**
 * Page frame. A route that starts with a dark hero exports `handle = { darkHero: true }`: the header
 * then starts transparent and the hero itself makes room for it. Otherwise main is pushed below the
 * fixed header.
 */
export function SiteLayout({ children }) {
  const matches = useMatches();
  const darkHero = matches.some((m) => m.handle?.darkHero);
  return (
    <div className="flex min-h-dvh flex-col">
      <Header overHero={darkHero} />
      <main id="main" tabIndex={-1} className={`flex-1 ${darkHero ? "" : "pt-16"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
