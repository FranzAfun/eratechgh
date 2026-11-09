import { useMatches } from "react-router";
import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";

/**
 * Page frame. A route that starts with a dark band (home hero, request band, 404) exports
 * `handle = { darkHero: true }`: the header then starts transparent over the band and turns glass
 * after 24 px of scroll, and the band pads its own content by the header height. Otherwise main is
 * pushed below the fixed header.
 */
export function SiteLayout({ children, darkTop = false }) {
  const matches = useMatches();
  const darkHero = darkTop || matches.some((m) => m.handle?.darkHero);
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
