import { pageMeta } from "../lib/meta.js";

const TITLES = {
  request: [
    "Start a request",
    "Request component sourcing, a project assessment or an expert consultation from ERA Tech.",
  ],
  "request-sourcing": [
    "Request component sourcing",
    "Tell us the parts you need. ERA Tech sends a free itemised quote.",
  ],
  "request-assessment": [
    "Request a project assessment",
    "ERA Tech reviews your project idea, recommends parts and quotes them. GH₵50.",
  ],
  "request-consultation": [
    "Request an expert consultation",
    "Book time with an ERA Tech expert for guidance on your project. GH₵250.",
  ],
};

export const meta = ({ matches }) => {
  const id = matches.at(-1)?.id;
  const [title, description] = TITLES[id] ?? TITLES.request;
  return pageMeta(title, description);
};

export default function Request() {
  return (
    <main className="mx-auto max-w-form px-4 py-16">
      <h1 className="text-h1 font-semibold">Start a request</h1>
      <p className="mt-4 text-text-secondary">Request form placeholder.</p>
    </main>
  );
}
