/**
 * All site text and settings live here.
 * Unknown values are null (or empty), never invented. See docs/STATUS.md → "Need from Franz".
 */

export const site = {
  name: "ERA Tech",
  wordmark: "ERA Tech · Project Desk",
  tagline: "Built for students, makers and innovators in Ghana",

  /** eraaxis.com privacy policy URL — pending from ERA. While null, "Privacy policy" is plain text. */
  privacyUrl: null,
  /** Public contact email for the footer and error messages — pending from ERA. While null, it's hidden. */
  teamEmail: null,
  /**
   * Real, approved project photos only. "Our work" (and its nav link) shows at 3+ entries.
   * Entry shape: { src, width, height, alt, caption }
   */
  portfolio: [],
  /** The minimum number of real photos before "Our work" appears. */
  portfolioMinimum: 3,

  startRequest: { label: "Start a request", to: "/request" },

  /** Home-page sections in the header/footer nav. `requiresPortfolio` hides a link until photos exist. */
  nav: [
    { label: "Services", hash: "services" },
    { label: "Design", hash: "design" },
    { label: "Our work", hash: "work", requiresPortfolio: true },
    { label: "How it works", hash: "how-it-works" },
    { label: "FAQ", hash: "faq" },
  ],

  header: {
    menuOpen: "Open menu",
    menuClose: "Close menu",
    navLabel: "Main",
    skipLink: "Skip to content",
  },

  footer: {
    navLabel: "Footer",
    privacy: "Privacy policy",
    contactLabel: "Email",
    copyright: (year) => `© ${year} ERA Tech`,
  },

  notFound: {
    title: "Page not found",
    metaDescription: "This page doesn't exist on ERA Tech Project Desk.",
    body: "The page you're looking for doesn't exist or has moved.",
    home: "Go to the home page",
    request: "Start a request",
  },
};

/** True when "Our work" may be shown. */
export function hasPortfolio(s = site) {
  return Array.isArray(s.portfolio) && s.portfolio.length >= s.portfolioMinimum;
}

/** Nav items that should render right now. */
export function visibleNav(s = site) {
  return s.nav.filter((item) => !item.requiresPortfolio || hasPortfolio(s));
}
