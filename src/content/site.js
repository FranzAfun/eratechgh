/**
 * All site text and settings live here.
 * Unknown values are null (or empty), never invented. See docs/STATUS.md → "Need from Franz".
 */

export const site = {
  name: "ERA Tech",
  wordmark: "ERA Tech · Project Desk",
  tagline: "Built for students, makers and innovators in Ghana",

  /** ERA's privacy policy (decided 2026-11-09). Opens in a new tab. */
  privacyUrl: "https://eraaxis.com/privacy",
  /** Public contact email for the footer and error messages — pending from ERA. While null, it's hidden. */
  teamEmail: null,
  /**
   * Real, approved project photos only. "Our work" (and its nav link) shows at 3+ entries.
   * Entry shape: { src, width, height, alt, caption }
   */
  portfolio: [],
  /** The minimum number of real photos before "Our work" appears. */
  portfolioMinimum: 3,

  /** Real ERA Dev Board photo (from ERA's own assets). */
  devBoardPhoto: {
    src: "/images/dev-board-main-640.webp",
    srcSet: "/images/dev-board-main-640.webp 640w, /images/dev-board-main-768.webp 768w",
    width: 640,
    height: 800,
    alt: "The ERA Dev Board: a blue board with a four-battery holder, power switch and two breadboard strips",
  },

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
    brand: "ERA Tech",
    label: "Project Desk",
    homeLabel: "ERA Tech Project Desk, home",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuTitle: "Menu",
    navLabel: "Main",
    skipLink: "Skip to content",
  },

  footer: {
    navLabel: "Footer",
    about:
      "ERA Tech helps students, makers and innovators in Ghana source components, check their project plans and get expert advice.",
    servicesTitle: "Services",
    siteTitle: "Site",
    contactTitle: "Contact",
    contactLabel: "Email",
    contactFallback: "Send us a request",
    contactFallbackNote: "The team replies by email, phone or WhatsApp.",
    privacy: "Privacy policy",
    copyright: (year) => `© ${year} ERA Tech. All rights reserved.`,
    drawerCopyright: (year) => `© ${year} ERA Tech`,
    /** Footer "Site" column: home sections (+ ERA Store) and the request page. */
    siteLinks: [
      { label: "Services", hash: "services" },
      { label: "Design", hash: "design" },
      { label: "Our work", hash: "work", requiresPortfolio: true },
      { label: "How it works", hash: "how-it-works" },
      { label: "ERA Store", hash: "store" },
      { label: "FAQ", hash: "faq" },
    ],
  },

  /** The three services. `slug` is the URL: /request/<slug>. Prices are exactly as approved; no "was" prices. */
  services: [
    {
      slug: "sourcing",
      name: "Component sourcing",
      shortName: "Sourcing",
      icon: "sourcing",
      price: "Free quote",
      priceNote: "You pay for parts and delivery only after you approve the quote.",
      summary:
        "Send your parts list. We track down the components and send you an itemised quote, delivery included.",
      steps: [
        "List the parts and quantities you need",
        "Get an itemised quote with delivery",
        "Approve and pay, and we get the parts to you",
      ],
      cta: "Get a free quote",
      featured: false,
    },
    {
      slug: "assessment",
      name: "Project assessment",
      shortName: "Assessment",
      icon: "assessment",
      price: "GH₵50",
      priceNote: "Covers the review. Parts and full design work are separate.",
      summary:
        "We review your project idea, recommend the parts it needs and quote them, so you start on the right track.",
      steps: [
        "Tell us about your project",
        "Pay GH₵50 and send your full abstract",
        "Get our review, a parts list and a quote",
      ],
      cta: "Request an assessment",
      featured: true,
      badge: "Good place to start",
    },
    {
      slug: "consultation",
      name: "Expert consultation",
      shortName: "Consultation",
      icon: "consultation",
      price: "GH₵250",
      priceNote:
        "Did an assessment and bought the parts through us? Ask for 70 % off: GH₵75. We check eligibility.",
      summary:
        "Time with an ERA Tech expert on your project: design choices, the problem you're stuck on, and what to do next.",
      steps: [
        "Share your abstract and what you need help with",
        "We confirm a time and send payment details",
        "Meet the expert and leave with clear next steps",
      ],
      cta: "Book a consultation",
      featured: false,
    },
  ],

  home: {
    hero: {
      eyebrow: "For students, makers and innovators in Ghana",
      title: "Parts, project reviews and expert advice. One request.",
      body: "Tell us what you're building. We source your components, review your project or set up time with an expert, and you see the price before you pay anything.",
      primary: { label: "Source components", to: "/request/sourcing" },
      secondary: { label: "Book a consultation", to: "/request/consultation" },
      facts: ["Free sourcing quotes", "Assessments GH₵50", "Expert consultations"],
      /** The glass card on the hero visual. Example part names only, no prices. */
      card: {
        title: "Your parts list",
        rows: ["Microcontroller board", "Soil moisture sensor", "LEDs and resistors"],
        status: "Quote ready",
      },
    },
    services: {
      eyebrow: "Services",
      title: "Three ways we can help",
      intro:
        "Pick what you need. Every request goes straight to the ERA Tech team, who reply with the next step.",
      stepsLabel: "How it goes",
    },
    design: {
      eyebrow: "Design",
      title: "Need more than parts? We design too",
      intro:
        "ERA Tech also designs and builds hardware with you, from the circuit to the enclosure.",
      caption: "Illustration — not a client project",
      footnote: "Detailed design and fabrication are quoted separately.",
      tiles: [
        {
          key: "pcb",
          title: "Electronics & PCB",
          body: "Circuit design, schematics and printed circuit boards.",
        },
        {
          key: "cad",
          title: "3D CAD & product design",
          body: "Enclosures, mechanical parts and models ready to print or machine.",
        },
        {
          key: "iot",
          title: "IoT & connected systems",
          body: "Sensors, microcontrollers and devices that talk to the internet.",
        },
        {
          key: "automation",
          title: "Automation & prototyping",
          body: "Motors, control and working prototypes you can test.",
        },
      ],
    },
    work: {
      eyebrow: "Our work",
      title: "Projects we've helped build",
      intro: "",
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "From request to parts in three steps",
      steps: [
        {
          title: "Tell us what you're building",
          body: "Pick a service and fill in one short form.",
        },
        {
          title: "We confirm the next step",
          body: "The team replies with your quote, payment details and timing. Nothing happens without your OK.",
        },
        {
          title: "Get your parts or your session",
          body: "We deliver the components or meet you for the consultation.",
        },
      ],
    },
    store: {
      eyebrow: "ERA Store",
      title: "ERA Store is coming soon",
      badge: "Coming soon",
      intro: "Our online store for makers in Ghana. It will offer:",
      // Offer list from the brief, still to be confirmed by ERA (see docs/STATUS.md).
      offers: [
        { icon: "cpu", text: "Electronic components and modules" },
        { icon: "package", text: "Build Packs" },
        { icon: "board", text: "ERA Dev Board" },
        { icon: "truck", text: "Delivery across Ghana, and pickup" },
        { icon: "phone", text: "Mobile Money and card payments" },
      ],
      notify: "Want to know when it opens? Tick the box when you send a request.",
      logoAlt: "ERA Store",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions, answered",
      intro: "Can't find yours? Ask it in your request.",
      items: [
        {
          q: "Is the sourcing quote really free?",
          a: "Yes. The itemised quote is free. You pay for the parts and delivery only after you approve it.",
        },
        {
          q: "What does the GH₵50 assessment cover?",
          a: "We review your project idea, recommend the parts it needs and quote them. The fee doesn't cover the parts themselves or full design work.",
        },
        {
          q: "How does the 70 % off a consultation work?",
          a: "If you did an ERA Tech assessment and bought the parts through ERA Tech, tick the box on the consultation form. We check your eligibility. If it's confirmed, the consultation costs GH₵75 instead of GH₵250.",
        },
        {
          q: "Is my consultation booked when I send the form?",
          a: "Not yet. The team gets back to you to confirm a time and payment. Nothing is booked until they do.",
        },
        {
          q: "Does a consultation include CAD, PCB design or a prototype?",
          a: "No. A consultation is advice and guidance. Design work and prototypes are quoted separately.",
        },
        {
          q: "Is delivery included?",
          a: "Delivery is quoted together with your parts, so you see the full cost before you pay.",
        },
        {
          q: "How will you contact me?",
          a: "The ERA Tech team replies by email, phone or WhatsApp, using the details you give in the form.",
        },
      ],
    },
    closing: {
      title: "Got a project in mind? Let's get it moving.",
      body: "Send one request. The ERA Tech team replies with the next step.",
    },
  },

  request: {
    title: "Start a request",
    intro:
      "Pick a service and tell us about your project. The ERA Tech team replies with the next step.",
    pickerLabel: "What do you need?",
    pickerHint: "Choose a service to see its form.",
    detailsTitle: "Your details",
    extrasTitle: "Extras",
    checkTitle: "Quick check",
    checkHint: "This helps us stop spam.",
    send: "Send request",
    sending: "Sending…",
    priceLabel: "Price",
    consent: "We use these details only to reply to your request.",
    privacy: "Privacy policy",
    labels: {
      fullName: "Full name",
      email: "Email",
      phone: "Phone / WhatsApp",
      town: "Town or city",
      components: "Components and quantities",
      neededBy: "Needed by",
      projectTitle: "Project title",
      projectArea: "Project area",
      description: "What should it do?",
      abstract: "Project abstract",
      guidance: "What guidance do you need most?",
      preferredDate: "Preferred date",
      preferredTime: "Preferred time",
      discountRequested:
        "I did an ERA Tech assessment and bought the parts through ERA Tech — I'd like to ask for 70 % off",
      storeOptIn: "Tell me when ERA Store opens",
    },
    hints: {
      phone: "Digits, spaces and + only. We may reply on WhatsApp.",
      components: "One part per line helps, e.g. “ESP32 dev board × 2”.",
      abstract: "What the project is, how it should work and where you are with it.",
    },
    placeholders: {
      choose: "Choose…",
    },
    notes: {
      sourcing: "Your quote is free. You pay for parts and delivery only after you approve it.",
      assessment: "We send GH₵50 payment details first, then ask for your full abstract.",
      consultation: "Nothing is booked until the team confirms a time and payment with you.",
    },
    errors: {
      check: "Please complete the check and try again.",
      tooMany: "Too many requests from your connection. Wait a minute and try again.",
      server: "We couldn't send your request. Your details are still here — try again",
      serverEmail: (email) => `, or email ${email}.`,
      fixFields: "Please fix the highlighted fields.",
      checkMissing: "The spam check isn't set up on this preview (no site key).",
    },
    sent: {
      title: "Request sent",
      reference: "Your reference",
      copy: (email) =>
        `We've emailed a copy to ${email} — check spam if it's not there in a few minutes.`,
      again: "Send another request",
    },
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

/** Footer "Site" links that should render right now. */
export function visibleSiteLinks(s = site) {
  return s.footer.siteLinks.filter((item) => !item.requiresPortfolio || hasPortfolio(s));
}
