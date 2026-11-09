/**
 * All site text and settings live here.
 * Unknown values are null (or empty), never invented. See docs/STATUS.md → "Need from the owner".
 */

/**
 * Names (decided 2026-11-09). Change them here only; everything else reads them.
 * - brandName: the everyday brand (wordmark, headings, body copy: "the ERA Tech team").
 * - productName: this site's product.
 * - legalName: formal spots only (footer ©, email sign-off, consent line).
 */
export const brandName = "ERA Tech";
export const productName = "Project Desk";
export const legalName = "ERA Technologies";
/** "ERA Tech · Project Desk": wordmark, home <title>, the end of every other <title>. */
export const siteTitle = `${brandName} · ${productName}`;
/** Canonical production origin for metadata and sharing. */
export const siteBaseUrl = "https://eratechgh.com";
const shareSubtitle = "Parts, project reviews and expert advice for students and makers in Ghana";
export const shareImage = {
  path: "/og.png",
  width: 1200,
  height: 630,
  subtitle: shareSubtitle,
  alt: `${siteTitle} — ${shareSubtitle}`,
};

const logoVariant = (role, width, height) => ({
  src: `/images/brand/logo-white-${role}.webp`,
  srcSet: `/images/brand/logo-white-${role}.webp 1x, /images/brand/logo-white-${role}@2x.webp 2x`,
  fallback: `/images/brand/logo-white-${role}.png`,
  fallbackSrcSet: `/images/brand/logo-white-${role}.png 1x, /images/brand/logo-white-${role}@2x.png 2x`,
  width,
  height,
});

export const brandLogo = {
  header: logoVariant("header", 69, 40),
  drawer: logoVariant("drawer", 62, 36),
  footer: logoVariant("footer", 82, 48),
  email: { src: "/email/logo-white.png", width: 120, height: 70 },
};

export const socials = [
  ["linkedin", "LinkedIn", "https://www.linkedin.com/company/era-axis"],
  ["x", "X", "https://x.com/ERRAAXIS"],
  ["instagram", "Instagram", "https://www.instagram.com/era_axis"],
  ["tiktok", "TikTok", "https://www.tiktok.com/@eraaxis"],
  ["whatsapp", "WhatsApp", "https://whatsapp.com/channel/0029Va9foNM002T9PHdytX1h"],
].map(([id, name, url]) => ({
  id,
  name,
  url,
  icon: `/images/social/${id}-24.webp`,
  icon2x: `/images/social/${id}-48.webp`,
  png: `/images/social/${id}-24.png`,
  png2x: `/images/social/${id}-48.png`,
  emailIcon: `/email/${id}.png`,
}));

const workImage = (id, width, height, kind, caption, alt) => ({
  id,
  src: `/images/work/${id}-640.webp`,
  srcSet: `/images/work/${id}-640.webp 640w, /images/work/${id}-${width}.webp ${width}w`,
  width,
  height,
  kind,
  caption,
  alt,
});

export const site = {
  brandName,
  productName,
  legalName,
  siteTitle,
  logo: brandLogo,
  socials,
  tagline: "Built for students, makers and innovators in Ghana",

  /** ERA's privacy policy (decided 2026-11-09). Opens in a new tab. */
  privacyUrl: "https://eraaxis.com/privacy",
  /** Public contact email for the footer and error messages — pending from ERA. While null, it's hidden. */
  teamEmail: null,
  /**
   * Owner-approved work images; kind distinguishes photographs from CAD/layout/render images.
   * "Our work" and its nav links show only when at least three photographs are present.
   */
  portfolio: [
    workImage(
      "01-sand-sieve-cad-exploded-view",
      1029,
      747,
      "cad",
      "3D CAD design",
      "Exploded 3D CAD view of a sand sieving machine showing the fixed and removable mesh screens, vibration shaft, pulley, belt and synchronous motor",
    ),
    workImage(
      "02-sand-sieve-machine-built",
      1080,
      810,
      "photo",
      "Built and tested",
      "The finished sand sieving machine: a black steel frame with mesh screens, belt drive and electric motor, standing on grass",
    ),
    workImage(
      "03-controller-prototype-perfboard",
      1280,
      960,
      "photo",
      "Prototype",
      "Controller prototype on perfboard with an Arduino Nano, a GSM module and two 30 A relays",
    ),
    workImage(
      "04-controller-pcb-layout",
      1280,
      853,
      "layout",
      "PCB layout",
      "Two-layer PCB layout with a microcontroller, relays and power components",
    ),
    workImage(
      "05-iot-board-3d-render",
      1280,
      960,
      "render",
      "3D render",
      "3D render of a blue circuit board with a SIM card holder, wireless module and USB-C port",
    ),
    workImage(
      "06-smart-lock-prototype",
      1280,
      960,
      "photo",
      null,
      "Smart lock prototype on a workbench: an LCD unit reading 'Smart Lock System' beside a small wooden test door",
    ),
  ],
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
    { label: "ERA Store", hash: "store" },
    { label: "FAQ", hash: "faq" },
  ],

  header: {
    homeLabel: `${siteTitle}, home`,
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuTitle: "Menu",
    navLabel: "Main",
    skipLink: "Skip to content",
  },

  footer: {
    followUs: "Follow us",
    navLabel: "Footer",
    about:
      "Project Desk is the ERA Tech team's request desk for students, makers and innovators in Ghana: source components, check your project plans and get expert advice.",
    servicesTitle: "Services",
    siteTitle: "Site",
    contactTitle: "Contact",
    contactLabel: "Email",
    contactFallback: "Send us a request",
    contactFallbackNote: "The team replies by email, phone or WhatsApp.",
    privacy: "Privacy policy",
    copyright: (year) => `© ${year} ${legalName}. All rights reserved.`,
    drawerCopyright: (year) => `© ${year} ${legalName}`,
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
        "Send your parts list. We track down the components and send you an itemised quote that shows the delivery cost.",
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
      eyebrow: `${productName} · For students and makers in Ghana`,
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
      title: "Three ways Project Desk can help",
      intro:
        "Pick what you need. Every Project Desk request goes straight to the ERA Tech team, who reply with the next step.",
      stepsLabel: "How it goes",
    },
    design: {
      eyebrow: "Design",
      title: "Need more than parts? We design too",
      intro:
        "ERA Tech also designs and builds hardware as paid work, from the circuit to the enclosure.",
      caption: "Illustration — not a client project",
      footnote:
        "Design and fabrication are paid work, quoted separately once we understand your project. Start with a consultation or mention it in your request.",
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
      title: "Real builds from the ERA Tech team",
      intro: "From CAD and circuit layouts to workshop prototypes and finished builds.",
      stories: [
        {
          id: "sand-sieve",
          title: "Motorised sand sieving machine",
          copy: "Designed in 3D CAD, then built: a motor-driven vibration shaft shakes two mesh screens to separate fine sand from coarse material.",
          imageIds: ["01-sand-sieve-cad-exploded-view", "02-sand-sieve-machine-built"],
        },
        {
          id: "prototype-to-pcb",
          title: "From prototype to PCB",
          copy: "Circuits are proven on perfboard first, then laid out as printed circuit boards and checked in 3D before fabrication.",
          imageIds: [
            "03-controller-prototype-perfboard",
            "04-controller-pcb-layout",
            "05-iot-board-3d-render",
          ],
        },
        {
          id: "smart-lock",
          title: "Smart lock system",
          copy: "A working smart lock prototype: an LCD control unit and the lock fitted to a test door, built and tested in the workshop.",
          imageIds: ["06-smart-lock-prototype"],
        },
      ],
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
        { icon: "phone", text: "Mobile Money payments" },
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
          q: "Can ERA Tech design my PCB or enclosure?",
          a: "Yes. PCB, 3D CAD, IoT and automation design are paid work, quoted after we understand your project. Start with a consultation, or mention it in your request.",
        },
        {
          q: "Is delivery included?",
          a: "Delivery isn't free: its cost is shown in your quote with the parts, so you see the full price before you pay.",
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
    eyebrow: "Project Desk",
    title: "Start a request",
    intro:
      "Pick a service, tell us about your project, and the ERA Tech team replies with the next step.",
    pickerLabel: "What do you need?",
    pickerHint: "Choose a service to see its form.",
    sideTitle: "What happens next",
    sideEmpty: "Pick a service to see its price and what happens after you send.",
    sideReply: "The team replies by email, phone or WhatsApp.",
    detailsTitle: "Your details",
    extrasTitle: "Extras",
    checkTitle: "Quick check",
    checkHint: "This helps us stop spam.",
    send: "Send request",
    sending: "Sending…",
    priceLabel: "Price",
    /** Consent checkbox (DESIGN-DIRECTION.md §7). The link wraps "privacy policy". */
    consent: {
      before: `I agree to ${legalName} using these details to reply to my request, as described in the `,
      link: "privacy policy",
      after: ".",
      newTab: "(opens in a new tab)",
      hint: "Tick the privacy box to send.",
    },
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
    metaDescription: `This page doesn't exist on ${siteTitle}.`,
    body: "This page isn't part of Project Desk, or it has moved. Head home or start a request.",
    home: "Go to the home page",
    request: "Start a request",
  },
};

/** True when "Our work" may be shown. */
export function hasPortfolio(s = site) {
  return (
    Array.isArray(s.portfolio) &&
    s.portfolio.filter((image) => image.kind === "photo").length >= s.portfolioMinimum
  );
}

/** Nav items that should render right now. */
export function visibleNav(s = site) {
  return s.nav.filter((item) => !item.requiresPortfolio || hasPortfolio(s));
}

/** Footer "Site" links that should render right now. */
export function visibleSiteLinks(s = site) {
  return s.footer.siteLinks.filter((item) => !item.requiresPortfolio || hasPortfolio(s));
}
