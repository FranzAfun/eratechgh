import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";

export function SiteLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
